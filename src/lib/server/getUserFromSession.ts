import { eq } from 'drizzle-orm';
import { db } from './db';
import { sessionsTable, usersTable } from './db/schema';

export const getUserFromSession = async (session: string | null | undefined) => {
	if (!session) {
		return false;
	}

	const user = await db
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.token, session))
		.rightJoin(usersTable, eq(sessionsTable.userId, usersTable.id));

	if (user.length < 1) {
		return false;
	}

	return user[0].user;
};
