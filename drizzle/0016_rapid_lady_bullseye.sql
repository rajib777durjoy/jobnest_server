CREATE TABLE "appliedList" (
	"Apply_id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(150),
	"email" varchar(150),
	"JobTitle" text,
	"resume" text DEFAULT '',
	"phone" text,
	"loaction" text,
	"JobType" text,
	"salary" integer,
	"description" text,
	"Job_id" integer
);
--> statement-breakpoint
ALTER TABLE "appliedList" ADD CONSTRAINT "appliedList_Job_id_JobCollection_Job_id_fk" FOREIGN KEY ("Job_id") REFERENCES "public"."JobCollection"("Job_id") ON DELETE cascade ON UPDATE no action;