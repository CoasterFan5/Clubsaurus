CREATE TABLE "sessions" (
	"token" varchar(1028) PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"created" date NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;