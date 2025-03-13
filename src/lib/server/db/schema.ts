import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const organizationsTable = pgTable('organization', {
	id: serial('orgId').primaryKey(),
	name: varchar({ length: 256 })
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
	hash: varchar({ length: 1028 }).notNull(),
	salt: varchar({ length: 1028 }).notNull()
});
