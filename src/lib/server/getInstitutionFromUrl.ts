import { eq } from 'drizzle-orm';
import { domainsTable, institutionsTable } from './db/schema';
import { db } from './db';

export const getInstitutionFromUrl = async (url: URL) => {
	const host = url.hostname;

	const orgList = await db
		.select()
		.from(domainsTable)
		.where(eq(domainsTable.domain, host))
		.leftJoin(institutionsTable, eq(institutionsTable.id, domainsTable.institutionId));

	if (orgList.length < 1) {
		return null;
	}

	return orgList[0].institution;
};
