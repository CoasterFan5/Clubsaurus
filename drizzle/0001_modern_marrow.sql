ALTER TABLE "domain" ALTER COLUMN "domain" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "salt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "domain" ADD COLUMN "organizationId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "organizationId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "domain" ADD CONSTRAINT "domain_organizationId_organization_orgId_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("orgId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_organizationId_organization_orgId_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("orgId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "domain";