CREATE TABLE "secureTokens" (
	"token" varchar(1028) PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"issuedByUserId" integer NOT NULL,
	CONSTRAINT "secureTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "secureTokens" ADD CONSTRAINT "secureTokens_issuedByUserId_user_userId_fk" FOREIGN KEY ("issuedByUserId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;