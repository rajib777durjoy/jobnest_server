import { pgTable, unique, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usersTable = pgTable("users_table", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 150 }).notNull(),
	password: text().notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	profile: text(),
}, (table) => [
	unique("users_table_email_key").on(table.email),
]);
