CREATE TABLE "JobAlert" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"category" text NOT NULL,
	"JobType" text,
	"location" text,
	"Alert" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "Messages" CASCADE;--> statement-breakpoint
ALTER TABLE "JobAlert" ADD CONSTRAINT "JobAlert_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;