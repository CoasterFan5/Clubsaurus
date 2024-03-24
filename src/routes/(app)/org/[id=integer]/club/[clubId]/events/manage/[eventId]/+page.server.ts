import { error, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions.js';
import { prisma } from '$lib/server/prismaConnection';
import { freqMapping, RRule } from '$lib/utils/rrule';

dayjs.extend(utc);

const typeUnsafeObjectFromEntries = <
	const T extends ReadonlyArray<readonly [PropertyKey, unknown]>
>(
	entries: T
): { [K in T[number] as K[0]]: K[1] } => {
	return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

const weekdays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
] as const;

export const load = async ({ parent, params }) => {
	const parentData = await parent();
	if (!parentData.clubPerms.admin && !parentData.clubPerms.manageEvents) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}/events`);
	}

	const event = await prisma.event.findUnique({
		where: {
			id: parseInt(params.eventId)
		}
	});

	if (!event) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}/events`);
	}

	return {
		event
	};
};

export const actions = {
	default: formHandler(
		z.object({
			title: z.string().min(1).max(100),
			description: z.string().max(1000).optional().nullable(),
			date: z.string().min(1).max(100),
			inputFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
			repeatEvery: z.coerce.number().optional().nullable(),
			repeatInterval: z.coerce.number().optional().nullable(),
			repeatType: z.enum(['indefinitely', 'amount', 'upTo']).optional().nullable(),
			repeatUpTo: z.string().optional().nullable(),
			monthlyDay: z.coerce.boolean().optional().nullable(),
			dayOfTheMonth: z.coerce.number().optional().nullable(),

			color: z.string(),

			// Generates weekdaySunday...weekdaySaturday
			...typeUnsafeObjectFromEntries(
				weekdays.map(
					(day) => [`weekday${day}` as const, z.coerce.boolean().optional().nullable()] as const
				)
			),

			// Generates weekN and week_N from (1,5) and (1,4) respectively
			...typeUnsafeObjectFromEntries(
				([1, 2, 3, 4, 5] as const).map(
					(i) => [`week${i}` as const, z.coerce.boolean().optional().nullable()] as const
				)
			),
			...typeUnsafeObjectFromEntries(
				([1, 2, 3, 4] as const).map(
					(i) => [`week_${i}` as const, z.coerce.boolean().optional().nullable()] as const
				)
			)
		}),
		async (formData, { params, cookies }) => {
			const {
				title,
				description,
				date,
				repeatEvery,
				repeatInterval,
				repeatType,
				repeatUpTo,
				inputFrequency,
				monthlyDay,
				dayOfTheMonth
			} = formData;

			const enabledWeekdays = [
				...(formData.weekdaySunday ? [RRule.SU] : []),
				...(formData.weekdayMonday ? [RRule.MO] : []),
				...(formData.weekdayTuesday ? [RRule.TU] : []),
				...(formData.weekdayWednesday ? [RRule.WE] : []),
				...(formData.weekdayThursday ? [RRule.TH] : []),
				...(formData.weekdayFriday ? [RRule.FR] : []),
				...(formData.weekdaySaturday ? [RRule.SA] : [])
			];

			const enabledWeeks = [
				...(formData.week1 ? [1] : []),
				...(formData.week2 ? [2] : []),
				...(formData.week3 ? [3] : []),
				...(formData.week4 ? [4] : []),
				...(formData.week5 ? [5] : []),
				...(formData.week_1 ? [-1] : []),
				...(formData.week_2 ? [-2] : []),
				...(formData.week_3 ? [-3] : []),
				...(formData.week_4 ? [-4] : [])
			];

			const parsedDate = dayjs(date).utcOffset(0).toDate();
			const rrule = new RRule({
				freq: freqMapping[inputFrequency ?? 'daily'],
				dtstart: parsedDate,
				wkst: RRule.SU,
				...(inputFrequency
					? {
							interval: repeatInterval ?? undefined,
							count: repeatType === 'amount' ? repeatEvery ?? undefined : undefined,
							until:
								repeatType === 'upTo' && repeatUpTo
									? dayjs(repeatUpTo).utcOffset(0).toDate()
									: undefined,
							bymonthday: inputFrequency === 'monthly' && monthlyDay ? dayOfTheMonth : undefined,
							byweekday:
								enabledWeekdays.length > 0 && inputFrequency !== 'daily'
									? inputFrequency === 'monthly' && !monthlyDay
										? enabledWeekdays.flatMap((weekday) => {
												if (enabledWeeks.length === 0) return [weekday];
												return enabledWeeks.map((week) => weekday.nth(week));
											})
										: !monthlyDay
											? enabledWeekdays
											: undefined
									: undefined
						}
					: {
							count: 1
						})
			});

			const session = cookies.get('session');

			const sessionCheck = await prisma.session.findUnique({
				where: {
					sessionToken: session
				},
				include: {
					user: {
						include: {
							clubUsers: {
								where: {
									clubId: parseInt(params.clubId)
								},
								include: {
									role: true
								}
							},
							orgUsers: {
								where: {
									organizationId: parseInt(params.id)
								},
								include: {
									role: true
								}
							}
						}
					}
				}
			});

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			const club = await prisma.club.findUnique({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				error(400, 'Invalid club ID');
			}

			// Make sure the user has permissions to create an event
			const permCheck = createClubPermissionsFromUser(sessionCheck.user, club);
			if (!permCheck.manageEvents && !permCheck.admin) {
				error(401, 'No Permissions');
			}

			const eventCheck = await prisma.event.findFirst({
				where: {
					id: parseInt(params.eventId)
				}
			});

			if (!eventCheck) {
				error(400, 'invalid event');
			}

			await prisma.event.update({
				where: {
					id: eventCheck.id
				},
				data: {
					title,
					description: description ?? undefined,
					date: rrule.toString(),
					clubId: club.id,
					draft: false,
					color: formData.color
				}
			});
		}
	)
};
