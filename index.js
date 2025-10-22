
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./Controllers/authRouter.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api',authRoute);


app.get('/',(req,res)=>{
res.send('server is running')
})


app.listen(port,()=>{
    console.log('server is runing on this port',port)
})