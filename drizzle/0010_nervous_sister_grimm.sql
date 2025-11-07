CREATE TABLE "Joblist" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"link" text,
	"snippet" text,
	"image" text DEFAULT '',
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Joblist" ADD CONSTRAINT "Joblist_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;