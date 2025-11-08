
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./Controllers/authRouter.js";
import userRoute from "./Controllers/userRouter.js";
dotenv.config();
import rateLimit from 'express-rate-limit';
import JobRouter from "./Controllers/JobRouter.js";

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: "Too many requests, please try again later."
});
const app = express();
const port = process.env.PORT || 7000;
app.use(limiter);
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());


app.use('/api',authRoute);
app.use('/api/user',userRoute);
app.use('/api/Jobs',JobRouter)

app.get('/',(req,res)=>{
res.send('server is running')
})


app.listen(port,()=>{
    console.log('server is runing on this port',port)
})