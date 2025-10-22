
import dotenv from "dotenv";
dotenv.config();
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./Model/schema.js",   
  out: "./drizzle",          
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});