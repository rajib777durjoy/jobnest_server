import { pgTable, unique, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usersTable = pgTable("users_table", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 150 }).notNull(),
	password: text(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow(),
	profile: text(),
	title: varchar({ length: 250 }).default('),
	description: varchar({ length: 400 }).default('),
	banner: text(),
	certificat: text().array(),
	certificatPdf: text(),
	skills: text().array().default([""]).notNull(),
	educations: text().array().default([""]).notNull(),
	experience: text().array().default([""]).notNull(),
	certificatpdf: text().array().default([""]).notNull(),
	languages: text().array().default([""]).notNull(),
}, (table) => [
	unique("users_table_email_unique").on(table.email),
]);
