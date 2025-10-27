
import express from "express";
import { upload } from "./multer.js";
import imagekit from "./Imagekit/imagekit.js";
import fs from "fs";
import db from "../lib/psqlDB.js";
import users_schema from "../Model/schema.js";
import bcrypt from "bcrypt";

import { eq } from "drizzle-orm";
import { genToken } from "./Token/isToken.js";
import verifyToken from "./Token/verifyToken.js";
import validator from "validator";


const authRoute = express.Router();

authRoute.post('/submitFrom', upload.single('profile'), async (req, res) => {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send({ message: "Invalid email format!" });
    }

    const user_check = await db.select().from(users_schema).where(eq(users_schema.email, email));
    console.log('check user', user_check)
    if (user_check) {
        const token = await genToken(user_check[0]?.email);
        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).send({ message: 'Token generated successfully' });
    }

    const files = await req.file;
    if (!files) {
        return res.status(404).send({ message: 'image is not found' })
    }

    const fileBuffer = fs.readFileSync(files.path);
    if (!fileBuffer) {
        return res.status(500).send({ message: "not found file" })
    }

    const result = await imagekit.upload({
        file: fileBuffer,
        fileName: files.originalname,
    });
    fs.unlinkSync(files.path)

    let photoUrl = result?.url;
    if (!password) return res.status(401).send({ message: 'password is not available ' })

    const hashPass = await bcrypt.hash(password, 10);
    const createUser = await db.insert(users_schema).values({
        name,
        email,
        password:hashPass,
        profile:photoUrl,
    }).returning();

    const token = await genToken(createUser[0]?.email);
    console.log(token)
    if (!token) {
        return res.status(401).send({ message: 'token generate failed' })
    }

    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).send(createUser);

});

authRoute.post('/signIn', async (req,res) => {
    const { email,password } = req.body;
    console.log("email::",email,password)
    if (!validator.isEmail(email)) {
        console.log('email is not validate::')
        return res.status(404).send({ message: 'Invalid email format' })
    }

    const user_check = await db.select().from(users_schema).where(eq(users_schema.email, email))
    if (user_check.length === 0) {
      return res.status(403).send({ message: 'Unauthorized user' });
    }
    console.log("user check::",user_check[0].password)
    if(!user_check[0]?.password){
     return res.status(404).send({message:'password is undifiend'})
    }
    const passwordCheck = await bcrypt.compare(password,user_check[0].password);
    console.log("passwordCheck::",passwordCheck)
    if (!passwordCheck) {
        return res.status(404).send({ message: 'Incorrect password' })
    }

    const token = await genToken(user_check[0].email);
    console.log(token)
    if (!token) {
        return res.status(401).send({ message: 'token generate failed' })
    }

    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).send({ message:'true'})

});

authRoute.post('/signOut/:email',verifyToken,async(req,res)=>{
    const { email } = req.params;
    const userEmail = req.email;

    if (email !== userEmail) {
        return res.status(401).send({ message:false})
    }
 
    res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }).send({ message:true});
});


authRoute.post('/googleSignIn',async(req,res) => {
const {name,email,photoUrl}=req.body;
console.log(name,email,photoUrl);
const user_check = await db.select().from(users_schema).where(eq(users_schema.email,email));
 console.log('user check::',user_check)
 if(user_check.length > 0){
 return res.send(user_check[0])   
 }
 const createUser = await db.insert(users_schema).values({name,email,profile:photoUrl}).returning();
 console.log(createUser[0]?.email)
 const token = await genToken(createUser[0]?.email)
    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).send(createUser[0])
});



export default authRoute;