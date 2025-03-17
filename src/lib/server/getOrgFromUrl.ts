import { eq } from 'drizzle-orm';
import { domainsTable, organizationsTable } from './db/schema';
import { db } from './db';

export const getOrgFromUrl = async (url: URL) => {
	const host = url.hostname;

	const orgList = await db
		.select()
		.from(domainsTable)
		.where(eq(domainsTable.domain, host))
		.leftJoin(organizationsTable, eq(organizationsTable.id, domainsTable.organizationId));

	if (orgList.length < 1) {
		return null;
	}

	return orgList[0].organization;
};
