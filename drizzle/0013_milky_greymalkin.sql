ALTER TABLE "users_table" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "JobCollection" ADD COLUMN "email" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "role" varchar(100) DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "skills";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "experience";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "education";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "certificate";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "certificateImg";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "language";--> statement-breakpoint
ALTER TABLE "JobCollection" ADD CONSTRAINT "JobCollection_email_unique" UNIQUE("email");