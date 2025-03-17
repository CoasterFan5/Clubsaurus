import { getUserFromSession } from '$lib/server/getUserFromSession';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { secureTokensTable, usersTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const user = await getUserFromSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/login');
	}

	const token = await db
		.select()
		.from(secureTokensTable)
		.where(
			and(
				eq(secureTokensTable.token, params.token),
				eq(secureTokensTable.type, 'emailVerification'),
				eq(secureTokensTable.issuedByUserId, user.id)
			)
		);

	if (token.length < 1) {
		return error(401, {
			message: 'Invalid token'
		});
	}

	await db
		.update(usersTable)
		.set({
			verifiedEmail: true
		})
		.where(eq(usersTable.id, user.id));
};
