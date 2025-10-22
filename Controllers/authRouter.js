
import express from "express";
import { upload } from "./multer.js";
import imagekit from "./Imagekit/imagekit.js";
import fs from "fs";
import db from "../lib/psqlDB.js";
import users_schema from "../Model/schema.js";
import bcrypt from "bcrypt";
const authRoute = express.Router();
import { eq } from "drizzle-orm";
import { genToken } from "./Token/isToken.js";
import verifyToken from "./Token/verifyToken.js";
import validator from "validator";
authRoute.post('/submitFrom', upload.single('profile'), async (req, res) => {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send({ message: "Invalid email format!" });
    }

    const user_check = await db.select().from(users_schema).where(eq(users_schema.email, email));
    console.log('check user', user_check)
    if (user_check) {
        const token = await genToken(user_check?.email);
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

    const token = await genToken(createUser?.email);
    if (!token) {
        return res.status(401).send({ message: 'token generate failed' })
    }

    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).send({ message: 'Token generated successfully' });

})

authRoute.post('/signIn', async (req,res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: 'Invalid email format' })
    }

    const user_check = await db.select().from(users_schema).where(eq(users_schema.email, email))
    if (!user_check) {
        return res.status(403).send({ message: 'Unauthorized user' })
    }

    const passwordCheck = await bcrypt.compare(password, user_check.password);
    if (passwordCheck) {
        return res.status(404).send({ message: 'Incorrect password' })
    }

    const token = await genToken(user_check.email);
    if (!token) {
        return res.status(401).send({ message: 'token generate failed' })
    }

    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).send({ message: 'signIn successfull' })

})

authRoute.post('/signOut', verifyToken, async (req, res) => {
    const { email } = req.body;
    const userEmail = req.email;

    if (email !== userEmail) {
        return res.status(401).send({ message: 'You are not vaild user !' })
    }

    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }).send({ message: "signout successful, token removed" });
})

authRoute.post('/googleSignIn', async (req, res) => {

})



export default authRoute;