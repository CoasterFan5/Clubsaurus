import { pgTable, serial, varchar, integer, boolean, timestamp, unique } from 'drizzle-orm/pg-core';

export const institutionsTable = pgTable('institution', {
	id: serial('institutionId').primaryKey(),
	name: varchar({ length: 256 }),
	allowRegistration: boolean().notNull().default(false),
	requireVerifiedEmail: boolean().notNull().default(true),
	loginMethod: varchar({ enum: ['emailPassword'] })
		.notNull()
		.default('emailPassword')
});

export const domainsTable = pgTable('domain', {
	id: serial('domainId').primaryKey(),
	domain: varchar({ length: 256 }).notNull(),
	institutionId: integer()
		.notNull()
		.references(() => institutionsTable.id)
});

export const usersTable = pgTable('user', {
	id: serial('userId').primaryKey(),
	institutionId: integer()
		.notNull()
		.references(() => institutionsTable.id),
	firstName: varchar({ length: 256 }).notNull(),
	lastName: varchar({ length: 256 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	verifiedEmail: boolean().notNull(),
	hash: varchar({ length: 1028 }).notNull(),
	salt: varchar({ length: 1028 }).notNull(),
	institutionAdmin: boolean().notNull().default(false)
});

export const secureTokensTable = pgTable('secureTokens', {
	token: varchar({
		length: 1028
	})
		.primaryKey()
		.unique(),
	type: varchar({ enum: ['emailVerification'] }).notNull(),
	created: timestamp().notNull().defaultNow(),
	issuedByUserId: integer()
		.references(() => usersTable.id)
		.notNull()
});

export const sessionsTable = pgTable('sessions', {
	token: varchar({ length: 1028 }).unique().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id),
	created: timestamp().notNull()
});

export const studentOrgsTable = pgTable('studentOrgs', {
	id: serial('orgId').notNull().unique(),
	institutionId: integer()
		.notNull()
		.references(() => institutionsTable.id),
	name: varchar({ length: 256 }).notNull(),
	created: timestamp().notNull().defaultNow()
});

export const studentOrgUserTable = pgTable(
	'studentOrgUser',
	{
		orgId: integer()
			.notNull()
			.references(() => studentOrgsTable.id),
		userId: integer()
			.notNull()
			.references(() => usersTable.id)
	},
	(t) => [unique('key').on(t.orgId, t.userId).nullsNotDistinct()]
);
