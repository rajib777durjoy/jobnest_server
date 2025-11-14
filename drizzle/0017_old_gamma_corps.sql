ALTER TABLE "appliedList" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "JobCollection" ADD COLUMN "createdAt" timestamp DEFAULT now();