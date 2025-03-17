import { db } from '$lib/server/db';
import { domainsTable, organizationsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url }) => {
	const host = url.hostname;

	const orgList = await db
		.select()
		.from(domainsTable)
		.where(eq(domainsTable.domain, host))
		.leftJoin(organizationsTable, eq(organizationsTable.id, domainsTable.organizationId));

	if (orgList.length < 1) {
		error(404, {
			message: 'No Organization'
		});
	}

	return {
		organizationInfo: {
			name: orgList[0].organization?.name
		},
		authInfo: {
			loginMethod: orgList[0].organization?.loginMethod,
			allowRegistration: orgList[0].organization?.allowRegistration
		}
	};
};
