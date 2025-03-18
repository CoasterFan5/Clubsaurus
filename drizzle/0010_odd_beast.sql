ALTER TABLE "organization" RENAME TO "institution";--> statement-breakpoint
ALTER TABLE "domain" RENAME COLUMN "organizationId" TO "institutionId";--> statement-breakpoint
ALTER TABLE "institution" RENAME COLUMN "orgId" TO "institutionId";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "organizationId" TO "institutionId";--> statement-breakpoint
ALTER TABLE "domain" DROP CONSTRAINT "domain_organizationId_organization_orgId_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_organizationId_organization_orgId_fk";
--> statement-breakpoint
ALTER TABLE "domain" ADD CONSTRAINT "domain_institutionId_institution_institutionId_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("institutionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_institutionId_institution_institutionId_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("institutionId") ON DELETE no action ON UPDATE no action;