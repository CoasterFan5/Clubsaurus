import { db } from '$lib/server/db';
import { domainsTable, institutionsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url }) => {
	const host = url.hostname;

	const orgList = await db
		.select()
		.from(domainsTable)
		.where(eq(domainsTable.domain, host))
		.leftJoin(institutionsTable, eq(institutionsTable.id, domainsTable.institutionId));

	if (orgList.length < 1) {
		error(404, {
			message: 'No Institution'
		});
	}

	return {
		instituionInfo: {
			name: orgList[0].institution?.name
		},
		authInfo: {
			loginMethod: orgList[0].institution?.loginMethod,
			allowRegistration: orgList[0].institution?.allowRegistration
		}
	};
};
