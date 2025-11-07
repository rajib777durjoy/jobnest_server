
import { integer } from "drizzle-orm/gel-core";
import { pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

const users_schema=pgTable("users_table",{
    id:serial("id").primaryKey(),
    name:varchar("name",{length:100}).notNull(),
    email:varchar("email",{length:150}).unique().notNull(),
    password:text("password"),
    profile:text("profile"),
    banner:text("banner"),
    title:varchar('title',{length:250}).default(""),
    description:varchar('description',{length:400}).default(""),
    created_date:timestamp("created_date").defaultNow(),
    skills:text("skills").array(),
    category:text("category").array(),
    experience:text('experience').array(),
    education:text('education').array(),
    certificate:text('certificate').array(),
    certificateImg:text("certificateImg").array(),
    language:text('language').array()
});
export default users_schema;

export const Joblist= pgTable('Joblist',{
    id:serial("id").primaryKey(),
    title:text("title"),
    link:text('link'),
    snippet:text("snippet"),
    image:text('image').default('')
})


 
