CREATE TABLE "domain" (
	"domainId" serial PRIMARY KEY NOT NULL,
	"domain" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"orgId" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"userId" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(256),
	"lastName" varchar(256),
	"email" varchar(256),
	"domain" varchar(256),
	"hash" varchar(1028),
	"salt" varchar(1028)
);
