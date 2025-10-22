import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const genToken=async(email)=>{
const token= await jwt.sign({email},process.env.SECRET_TOKEN_KEY, { expiresIn:"7d"});
return token;
}