import { error, redirect } from '@sveltejs/kit';

import { getClubUserFromSession } from '$lib/server/getClubUserFromSession.js';
import { prisma } from '$lib/server/prismaConnection.js';

export const GET = async ({ url, cookies }) => {
	if (!cookies.get('session')) {
		throw redirect(303, '/login');
	}

	const eventId = url.searchParams.get('id');
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(404, 'No code');
	}

	if (!eventId) {
		throw error(404, 'No ID');
	}

	const event = await prisma.clubAttendanceEvent.findFirst({
		where: {
			AND: {
				id: parseInt(eventId),
				attendanceCode: code
			}
		}
	});

	if (!event) {
		throw error(404, 'Invalid ID');
	}

	const clubUser = await getClubUserFromSession(cookies.get('session'), event.clubId.toString());

	if (!clubUser) {
		throw error(404, 'Not in club');
	}

	await prisma.clubAttendanceCheck.upsert({
		where: {
			clubId_userId_attendanceEventId: {
				userId: clubUser.clubUser.userId,
				clubId: event.clubId,
				attendanceEventId: event.id
			}
		},
		create: {
			userId: clubUser.clubUser.userId,
			clubId: event.clubId,
			attendanceEventId: event.id
		},
		update: {}
	});

	throw redirect(
		303,
		`/attendance/good?id=${event.id}&club=${clubUser.clubUser.clubId}&org=${clubUser.clubUser.organizationId}`
	);
};
