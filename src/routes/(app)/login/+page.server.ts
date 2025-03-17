import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/server/hashPassword';
import { createSession } from '$lib/server/createSession';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const isPasswordEnabled = parentData.authInfo.loginMethod == 'emailPassword';

	if (!isPasswordEnabled) {
		error(404, {
			message: 'Email Password login method not enabled'
		});
	}
};

export const actions = {
	login: actionHelper(
		z.object({
			email: z.string().min(1, 'Email is required'),
			password: z.string().min(1, 'Password is required')
		}),
		async ({ email, password }, { cookies }) => {
			const realEmail = email.toLowerCase().trim();

			const userSelectRes = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, realEmail));

			if (userSelectRes.length < 1) {
				return fail(401, {
					message: 'Email or password incorrect'
				});
			}

			const user = userSelectRes[0];
			const checkHash = hashPassword({
				password: password,
				salt: user.salt
			});

			if (checkHash.hash != user.hash) {
				return fail(401, {
					message: 'Email or password incorrect'
				});
			}

			await createSession(user, cookies);

			throw redirect(307, '/app');
		}
	)
};
