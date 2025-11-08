ALTER TABLE "JobCollection" ALTER COLUMN "webLink" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "JobCollection" ALTER COLUMN "deadline" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "JobCollection" ADD COLUMN "location" text;