import type { Cookies } from '@sveltejs/kit';
import { sessionsTable, usersTable } from './db/schema';
import crypto from 'crypto';
import { db } from './db';

/*
Returns the session token, but not necessary.
*/
export const createSession = async (user: typeof usersTable.$inferSelect, cookies: Cookies) => {
	const sessionToken = crypto.randomBytes(128).toString('base64url');

	await db.insert(sessionsTable).values({
		token: sessionToken,
		userId: user.id,
		created: new Date()
	});

	cookies.set('session', sessionToken, {
		path: '/'
	});

	return sessionToken;
};
