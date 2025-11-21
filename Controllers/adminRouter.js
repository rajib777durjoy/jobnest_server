
import express from "express";
import verifyUser from "./Token/verifyUser.js";
import db from "../lib/psqlDB.js";
import users_schema from "../Model/schema.js";
import verifyToken from "./Token/verifyToken.js";
import { ne } from "drizzle-orm";

const adminRouter= express.Router();
 
//Get All user list for admin page //
adminRouter.get('/usersList/:email',verifyToken,verifyUser,async(req,res)=>{
  const email = req.params.email;
  const verifEmail= req.email;
  if(email !== verifEmail){
    return res.status(403).send({message:'Invalid user access'})
  }
  const query = await db.select().from(users_schema).where(ne(users_schema.email,email))
  console.log('query::',query)
  res.send(query)  
})

export default adminRouter;