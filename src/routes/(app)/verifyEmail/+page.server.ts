import { getOrgFromUrl } from '$lib/server/getOrgFromUrl';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserFromSession } from '$lib/server/getUserFromSession';
import { sendEmailVerificationEmail } from '$lib/server/sendEmailVerification';

export const actions = {
	resendEmail: async ({ url, cookies }) => {
		const org = getOrgFromUrl(url);

		if (org == null) {
			return fail(401, {
				message: 'error getting org'
			});
		}

		const user = await getUserFromSession(cookies.get('session'));
		if (!user) {
			throw redirect(307, '/login');
		}

		const emailSend = await sendEmailVerificationEmail(user, url);

		if (!emailSend.success) {
			return {
				success: false,
				message: emailSend.error == 'TIME' ? 'Wait a few minutes' : 'An error occurred'
			};
		}

		return {
			success: true,
			message: 'Email sent!'
		};
	}
} satisfies Actions;
