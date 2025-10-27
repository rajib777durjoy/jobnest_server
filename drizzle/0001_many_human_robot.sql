ALTER TABLE "users_table" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "profile" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "created_date" timestamp DEFAULT now();