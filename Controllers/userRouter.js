
import express from "express";
import verifyToken from "./Token/verifyToken.js";
import db from "../lib/psqlDB.js";
import users_schema from "../Model/schema.js";
import { eq } from "drizzle-orm";

const userRoute= express.Router()

userRoute.get('/currentUser',verifyToken,async(req,res)=>{
  const user_email= req.email;
  console.log(user_email)
  const getUser = await db.select().from(users_schema).where(eq(users_schema.email,user_email));
  console.log('currentuser::',getUser[0]);
  res.status(200).send(getUser[0])

})

export default userRoute;