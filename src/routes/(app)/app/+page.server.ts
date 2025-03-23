import { db } from '$lib/server/db';
import { studentOrgsTable, studentOrgUserTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const userOrgs = db
		.select({
			studentOrgsTable
		})
		.from(studentOrgUserTable)
		.where(and(eq(studentOrgUserTable.userId, parentData.user.id)))
		.rightJoin(studentOrgsTable, eq(studentOrgsTable.id, studentOrgUserTable.orgId));

	return {
		studentOrgs: userOrgs
	};
};
