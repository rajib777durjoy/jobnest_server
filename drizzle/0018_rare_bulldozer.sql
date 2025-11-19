CREATE TABLE "saveJobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"JobTitle" text NOT NULL,
	"location" text,
	"JobType" text NOT NULL,
	"webLink" text,
	"companyName" text NOT NULL,
	"salary" text NOT NULL,
	"deadline" date,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"Job_id" integer
);
--> statement-breakpoint
ALTER TABLE "saveJobs" ADD CONSTRAINT "saveJobs_Job_id_JobCollection_Job_id_fk" FOREIGN KEY ("Job_id") REFERENCES "public"."JobCollection"("Job_id") ON DELETE cascade ON UPDATE no action;