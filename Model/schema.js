
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const users_schema=pgTable("users_table",{
    id:serial("id").primaryKey(),
    name:varchar("name",{length:100}).notNull(),
    email:varchar("email",{length:150}).unique().notNull(),
    password:text("password"),
    profile:text("profile"),
    created_date:timestamp("created_date").defaultNow()
});
export default users_schema;
 
