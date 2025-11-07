import { eq } from "drizzle-orm";
import users_schema from "../../Model/schema.js";
import db from "../../lib/psqlDB.js";

const verifyUser=async(req,res,next)=>{
  const email= req.email;
  const user_Info= await db.select().from(users_schema).where(eq(users_schema.email,email));
  console.log('verifyUser',user_Info)
  if(user_Info.length === 0){
   return res.status(403).send({message:'Unauthorize Access'})
  }
  next()
};
export default verifyUser;

