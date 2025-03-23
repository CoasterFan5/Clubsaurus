import { db } from '$lib/server/db';
import { studentOrgsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const orgs = db
		.select()
		.from(studentOrgsTable)
		.where(eq(studentOrgsTable.institutionId, parentData.instituionInfo.id));

	return { orgs };
};
