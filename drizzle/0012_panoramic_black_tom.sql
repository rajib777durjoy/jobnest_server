CREATE TABLE "JobCollection" (
	"Job_id" serial PRIMARY KEY NOT NULL,
	"JobTitle" text NOT NULL,
	"JobType" text NOT NULL,
	"webLink" text NOT NULL,
	"companyName" text NOT NULL,
	"salary" text NOT NULL,
	"deadline" date NOT NULL,
	"description" text NOT NULL
);
