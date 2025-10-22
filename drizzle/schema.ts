import { pgTable, unique, serial, varchar, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usersTable = pgTable("users_table", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 150 }).notNull(),
	password: text().notNull(),
}, (table) => [
	unique("users_table_email_unique").on(table.email),
]);
