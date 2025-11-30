
import { integer } from "drizzle-orm/gel-core";
import { date, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

const users_schema=pgTable("users_table",{
    id:serial("id").primaryKey(),
    name:varchar("name",{length:100}).notNull(),
    email:varchar("email",{length:150}).unique().notNull(),
    password:text("password"),
    profile:text("profile"),
    banner:text("banner"),
    title:varchar('title',{length:250}).default(""),
    description:text('description').default(""),
    created_date:timestamp("created_date").defaultNow(),
    role:varchar('role',{length:100}).default("member")
});
export default users_schema;

export const Joblist= pgTable('Joblist',{
    id:serial("id").primaryKey(),
    title:text("title"),
    link:text('link'),
    snippet:text("snippet"),
    image:text('image').default('')
})

export const JobCollection= pgTable('JobCollection',{
    Job_id:serial("Job_id").primaryKey(),
    email:varchar('email',{langth:150}).notNull(),
    JobTitle:text("JobTitle").notNull(),
    location:text('location'),
    JobType:text("JobType").notNull(),
    working_time:text('working_time'),
    skills:text('skills'),
    webLink:text("webLink"),
    logo:text('logo'),
    experience:text('experience'),
    companyName:text('companyName').notNull(),
    salary:text("salary").notNull(),
    deadline:date("deadline"),
    status:text('status').default("Panding"),
    activity:text('activity').default('true'),
    requirement:text('requirement'),
    responsibility:text('responsibility'),
    description:text('description').notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
});


export const AppliedList= pgTable('appliedList',{
    Apply_id:serial('Apply_id').primaryKey(),
    fullName:varchar('fullName',{length:150}),
    email:varchar('email',{length:150}),
    ownerEmail:varchar('ownerEmail').notNull(),
    JobTitle:text('JobTitle'),
    resume:text('resume').default(''),
    phone:text('phone'),
    loaction:text('loaction'),
    JobType:text('JobType'),
    working_time:text('working_time'),
    salary:integer('salary'),
    status:text('status').default('panding'),
    description:text('description'),
    Job_id:integer('Job_id').references(()=>JobCollection.Job_id,{ onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const SaveJobs= pgTable('saveJobs',{
    id:serial("id").primaryKey(),
    createdAt: timestamp("createdAt").defaultNow(),
    user_id:integer('user_id').references(()=>users_schema.id,{onDelete:'cascade'}),
    Job_id:integer('Job_id').references(()=>JobCollection.Job_id,{ onDelete: "cascade" }),
})


 
