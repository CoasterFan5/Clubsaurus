import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { getClubUserFromSession } from '$lib/server/getClubUserFromSession.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { RRule } from '$lib/utils/rrule';

export const load = async ({ parent, params, url }) => {
	const parentData = await parent();
	if (!parentData.clubPerms.viewAttendance) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}`);
	}

	let event;

	const eventIdString = url.searchParams.get('eventId');
	if (eventIdString) {
		event = await prisma.clubAttendanceEvent.findFirst({
			where: {
				AND: {
					clubId: parentData.club.id,
					id: parseInt(eventIdString)
				}
			}
		});
	} else {
		event = await prisma.clubAttendanceEvent.findFirst({
			where: {
				clubId: parentData.club.id
			},
			orderBy: {
				date: 'desc'
			}
		});
	}

	if (!event) {
		event = await prisma.clubAttendanceEvent.create({
			data: {
				name: dayjs(Date.now()).format('MMMM DD, YYYY'),
				clubId: parentData.club.id,
				date: new Date()
			}
		});
	}

	const calEvents = await prisma.event.findMany({
		where: {
			clubId: parentData.club.id
		}
	});

	const allEvents = await prisma.clubAttendanceEvent.findMany({
		where: {
			clubId: parentData.club.id
		},
		orderBy: {
			date: 'desc'
		}
	});

	const members = await prisma.clubUser.findMany({
		where: {
			clubId: parentData.club.id
		},
		select: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					pfp: true,
					id: true,
					attendanceMarks: {
						where: {
							clubId: parentData.club.id
						},
						select: {
							attendanceEvent: true
						}
					}
				}
			}
		},
		orderBy: {
			user: {
				firstName: 'asc'
			}
		}
	});

	return {
		attendanceMembers: members,
		attendanceEvent: event,
		allEvents,
		calEvents
	};
};

export const actions = {
	create: formHandler(
		z.object({
			eventId: z.coerce.number(),
			date: z.coerce.date().optional()
		}),
		async ({ eventId, date }, { cookies, params, url }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);

			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const event = await prisma.event.findFirst({
				where: {
					id: eventId,
					clubId: clubUser.clubUser.clubId
				}
			});

			if (!event) {
				return {
					success: false,
					message: 'Invalid event id'
				};
			}

			if (!date) {
				const eventDate = RRule.fromString(event.date).after(new Date(), true);
				date = eventDate ? eventDate : new Date();
			}

			const attendanceEvent = await prisma.clubAttendanceEvent.create({
				data: {
					name: `${event.title}`,
					date: date,
					clubId: clubUser.clubUser.clubId,
					eventId: event.id
				}
			});
			url.searchParams.forEach((val, key) => {
				url.searchParams.delete(key);
			});
			url.searchParams.set('eventId', attendanceEvent.id.toString());

			throw redirect(303, url);
		}
	),
	renameEvent: formHandler(
		z.object({
			eventId: z.coerce.number(),
			name: z.string()
		}),
		async ({ eventId, name }, { params, cookies }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);

			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const eventTest = await prisma.clubAttendanceEvent.findFirst({
				where: {
					AND: {
						id: eventId,
						clubId: clubUser.clubUser.clubId
					}
				}
			});

			if (!eventTest) {
				return {
					success: false,
					message: 'No event'
				};
			}

			await prisma.clubAttendanceEvent.update({
				where: {
					id: eventTest.id
				},
				data: {
					name: name
				}
			});

			return {
				success: true,
				message: 'Club renamed!'
			};
		}
	),
	deleteEvent: formHandler(
		z.object({
			eventId: z.coerce.number(),
			name: z.string().optional()
		}),
		async ({ eventId }, { params, cookies }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);

			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const eventTest = await prisma.clubAttendanceEvent.findFirst({
				where: {
					AND: {
						id: eventId,
						clubId: clubUser.clubUser.clubId
					}
				}
			});

			if (!eventTest) {
				return {
					success: false,
					message: 'No event'
				};
			}

			await prisma.clubAttendanceEvent.delete({
				where: {
					id: eventTest.id
				}
			});

			throw redirect(303, `/org/${params.id}/club/${params.clubId}/attendance`);
		}
	),
	enableQr: formHandler(
		z.object({
			eventId: z.coerce.number()
		}),
		async ({ eventId }, { params, cookies, url }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);

			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const eventTest = await prisma.clubAttendanceEvent.findFirst({
				where: {
					AND: {
						id: eventId,
						clubId: clubUser.clubUser.clubId
					}
				}
			});

			if (!eventTest) {
				return {
					success: false,
					message: 'No event'
				};
			}

			await prisma.clubAttendanceEvent.update({
				where: {
					id: eventTest.id
				},
				data: {
					attendanceCode: crypto.randomBytes(8).toString('hex')
				}
			});

			url.searchParams.forEach((val, key) => {
				url.searchParams.delete(key);
			});
			url.searchParams.set('eventId', eventTest.id.toString());
			url.searchParams.set('showQr', 'true');

			throw redirect(303, url);
		}
	),
	deleteQr: formHandler(
		z.object({
			eventId: z.coerce.number()
		}),
		async ({ eventId }, { params, cookies }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);

			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const eventTest = await prisma.clubAttendanceEvent.findFirst({
				where: {
					AND: {
						id: eventId,
						clubId: clubUser.clubUser.clubId
					}
				}
			});

			if (!eventTest) {
				return {
					success: false,
					message: 'No event'
				};
			}

			await prisma.clubAttendanceEvent.update({
				where: {
					id: eventTest.id
				},
				data: {
					attendanceCode: null
				}
			});
		}
	),
	changeAttendance: formHandler(
		z.object({
			userId: z.coerce.number(),
			eventId: z.coerce.number()
		}),
		async ({ userId, eventId }, { cookies, params }) => {
			const clubUser = await getClubUserFromSession(cookies.get('session'), params.clubId);
			if (!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const event = await prisma.clubAttendanceEvent.findFirst({
				where: {
					id: eventId
				}
			});

			if (!event) {
				return {
					success: false,
					message: 'No event'
				};
			}

			const attendanceEvent = await prisma.clubAttendanceCheck.findFirst({
				where: {
					AND: {
						clubId: clubUser.clubUser.clubId,
						userId: userId,
						attendanceEventId: eventId
					}
				}
			});

			if (!attendanceEvent) {
				await prisma.clubAttendanceCheck.create({
					data: {
						clubId: clubUser.clubUser.clubId,
						userId: userId,
						attendanceEventId: eventId
					}
				});
				return {
					success: true,
					message: 'Marked Present!'
				};
			} else {
				await prisma.clubAttendanceCheck.delete({
					where: {
						clubId_userId_attendanceEventId: {
							clubId: clubUser.clubUser.clubId,
							userId: userId,
							attendanceEventId: eventId
						}
					}
				});
				return {
					success: true,
					message: 'Marked Absent!'
				};
			}
		}
	)
};
