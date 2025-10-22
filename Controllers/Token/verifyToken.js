import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const verifyToken= async(req,res,next)=>{
   const token =req.cookies.token;
   if(!token){
    return res.status(401).send({message:'Unauthorizes user access !'})
   }
   
 jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,decoded)=>{
   if(err){
    return res.status(403).send({message:'Invaild access token !'})
   }
   req.email= decoded.email;
   next();
  })
  
}
export default verifyToken;