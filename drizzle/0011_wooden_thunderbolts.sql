CREATE TABLE "studentOrgs" (
	"orgId" serial NOT NULL,
	"institutionId" integer NOT NULL,
	"name" varchar(256),
	"created" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "studentOrgs_orgId_unique" UNIQUE("orgId")
);
--> statement-breakpoint
CREATE TABLE "studentOrgUser" (
	"orgId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "key" UNIQUE NULLS NOT DISTINCT("orgId","userId")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "institutionAdmin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "studentOrgs" ADD CONSTRAINT "studentOrgs_institutionId_institution_institutionId_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("institutionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentOrgUser" ADD CONSTRAINT "studentOrgUser_orgId_studentOrgs_orgId_fk" FOREIGN KEY ("orgId") REFERENCES "public"."studentOrgs"("orgId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentOrgUser" ADD CONSTRAINT "studentOrgUser_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;