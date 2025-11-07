ALTER TABLE "users_table" ALTER COLUMN "certificat" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "certificat" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "certificatPdf" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "certificatPdf" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "educations" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "experience" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "languages" jsonb DEFAULT '[]'::jsonb;