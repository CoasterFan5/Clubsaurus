import { getUserFromSession } from '$lib/server/getUserFromSession';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const user = await getUserFromSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/login');
	}

	return {
		user: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			institutionAdmin: user.institutionAdmin
		}
	};
};
