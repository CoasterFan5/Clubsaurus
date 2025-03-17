import { pgTable, serial, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const organizationsTable = pgTable('organization', {
	id: serial('orgId').primaryKey(),
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
	organizationId: integer()
		.notNull()
		.references(() => organizationsTable.id)
});

export const usersTable = pgTable('user', {
	id: serial('userId').primaryKey(),
	organizationId: integer()
		.notNull()
		.references(() => organizationsTable.id),
	firstName: varchar({ length: 256 }).notNull(),
	lastName: varchar({ length: 256 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	verifiedEmail: boolean().notNull(),
	hash: varchar({ length: 1028 }).notNull(),
	salt: varchar({ length: 1028 }).notNull()
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
