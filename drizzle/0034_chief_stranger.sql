CREATE TABLE "Messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"sender_id" text NOT NULL,
	"recever_id" text NOT NULL
);
