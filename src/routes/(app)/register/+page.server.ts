import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/hashPassword';
import { getInstitutionFromUrl } from '$lib/server/getInstitutionFromUrl';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/server/createSession';
import { sendEmailVerificationEmail } from '$lib/server/sendEmailVerification';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const isPasswordEnabled = parentData.authInfo.loginMethod == 'emailPassword';

	if (!isPasswordEnabled) {
		error(404, {
			message: 'Email Password login method not enabled'
		});
	}

	if (!parentData.authInfo.allowRegistration) {
		error(404, {
			message: 'Registration is disabled.'
		});
	}
};

export const actions = {
	register: actionHelper(
		z.object({
			firstName: z.string().min(1, 'First name required!').max(256, 'First name too long'),
			lastName: z.string().min(1, 'Last name required!').max(256, 'Last name too long'),
			email: z.string().min(1, 'First name required!').max(256, 'Email too long'),
			pass1: z.string().min(1, 'Password is required!'),
			pass2: z.string()
		}),
		async ({ firstName, lastName, email, pass1, pass2 }, { url, cookies }) => {
			const institutionPromise = getInstitutionFromUrl(url);

			const realEmail = email.toLowerCase().trim();
			if (pass1 != pass2) {
				return fail(401, {
					message: 'Passwords must match'
				});
			}

			const passwordHash = hashPassword({
				password: pass1
			});

			const passwordCheck = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, realEmail));

			if (passwordCheck.length > 0) {
				return fail(401, {
					message: 'Email in use'
				});
			}

			const institution = await institutionPromise;
			if (!institution) {
				return fail(401, {
					message: 'Error parsing institution'
				});
			}

			const user = await db
				.insert(usersTable)
				.values({
					firstName,
					lastName,
					email: realEmail,
					verifiedEmail: false,
					hash: passwordHash.hash,
					salt: passwordHash.salt,
					institutionId: institution.id
				})
				.returning();

			await createSession(user[0], cookies);

			if (institution.requireVerifiedEmail) {
				await sendEmailVerificationEmail(user[0], url);
				throw redirect(307, '/verifyEmail');
			}

			throw redirect(307, '/app');
		}
	)
};
