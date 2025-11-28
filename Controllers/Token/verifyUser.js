import { eq } from "drizzle-orm";
import users_schema from "../../Model/schema.js";
import db from "../../lib/psqlDB.js";

export const memberVerify = async (req, res, next) => {
  const email = req.email;
  const user_Info = await db.select().from(users_schema).where(eq(users_schema.email,email));
  console.log("user info::", user_Info)
  if (user_Info[0].role !== 'member') {
   return  res.status(401).send({message:'Unauthorize user Access'})
  }
  next()

};

export const employerVerify = async(req,res,next)=>{
  const email = req.email;
  const user_Info = await db.select().from(users_schema).where(eq(users_schema.email,email));
  console.log("user info::", user_Info)
  if (user_Info[0].role !== 'employer') {
   return  res.status(401).send({message:'Unauthorize user Access'})
  }
  next();
}

export const adminVerify= async(req,res,next)=>{
  const email = req.email;
  const user_Info = await db.select().from(users_schema).where(eq(users_schema.email,email));
  console.log("user info::", user_Info)
  if (user_Info[0].role !== 'admin') {
   return  res.status(401).send({message:'Unauthorize user Access'})
  }
  next()
}

export const bothVerify = async(req,res,next)=>{
    const email = req.email;
  const user_Info = await db.select().from(users_schema).where(eq(users_schema.email,email));
  console.log("user info::", user_Info)
  if (user_Info[0].role !== 'admin' && user_Info[0].role !== 'employer') {
   return  res.status(401).send({message:'Unauthorize user Access'})
  }
  next()
}

