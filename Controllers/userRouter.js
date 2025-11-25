
import express from "express";
import fs from "fs";
import verifyToken from "./Token/verifyToken.js";
import db from "../lib/psqlDB.js";
import users_schema, { Joblist } from "../Model/schema.js";
import { eq } from "drizzle-orm";
import { upload } from "./multer.js";
import imagekit from "./Imagekit/imagekit.js";


const userRoute = express.Router()
userRoute.put('/profileUpdate', upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]), verifyToken, async (req, res) => {
  const data = req.body;
  const email = req.email;

  if (req.files?.profile && req.files?.banner) {
    const profile = req.files?.profile[0];
    const banner = req.files?.banner[0];

    const profileBuffer = fs.readFileSync(profile.path);

    const bannerBuffer = fs.readFileSync(banner.path);

    // console.log('pr', profileBuffer, 'ba', bannerBuffer)

    const profileImage = await imagekit.upload({
      file: profileBuffer,
      fileName: profile.originalname,
    });
    fs.unlinkSync(profile.path)

    const bannerImage = await imagekit.upload({
      file: bannerBuffer,
      fileName: banner.originalname,
    });
    fs.unlinkSync(banner.path)

    const updateUser = await db
      .update(users_schema)
      .set({
        name: data?.name,
        email: data?.email,
        title: data?.title,
        profile: profileImage?.url,
        banner: bannerImage?.url,
        description: data?.description
      })
      .where(eq(users_schema.email, email))  // or id
      .returning();
    console.log('updateUser', updateUser)
    return res.status(200).send(updateUser);
  }

  else if (req.files?.profile) {
    const profile = req.files?.profile[0];
    const profileBuffer = fs.readFileSync(profile.path);
    const profileImage = await imagekit.upload({
      file: profileBuffer,
      fileName: profile.originalname,
    });
    fs.unlinkSync(profile.path);
    const updateUser = await db
      .update(users_schema)
      .set({
        name: data?.name,
        email: data?.email,
        title: data?.title,
        profile: profileImage.url,
        banner: data?.banner,
        description: data?.description
      })
      .where(eq(users_schema.email, email))
      .returning();
    console.log('updateUser', updateUser)
    return res.status(200).send(updateUser)
  }

  else if (req.files?.banner) {
    const banner = req.files?.banner[0];
    const bannerBuffer = fs.readFileSync(banner.path);
    const bannerImage = await imagekit.upload({
      file: bannerBuffer,
      fileName: banner.originalname,
    });
    fs.unlinkSync(banner.path)

    const updateUser = await db
      .update(users_schema)
      .set({
        name: data?.name,
        email: data?.email,
        title: data?.title,
        profile: data?.profile,
        banner: bannerImage.url,
        description: data?.description
      })
      .where(eq(users_schema.email, email))  // or id
      .returning();
    console.log('updateUser', updateUser)
   return res.status(200).send(updateUser)

  }

  const updateUser = await db
    .update(users_schema)
    .set({
      name: data?.name,
      email: data?.email,
      title: data?.title,
      profile: data?.profile,
      banner: data?.banner,
      description: data?.description
    })
    .where(eq(users_schema.email, email))  // or id
    .returning();
  // console.log('updateUser', updateUser)
  res.status(200).send(updateUser)

})


userRoute.get('/currentUser', verifyToken, async (req, res) => {
  const user_email = req.email;
  // console.log(user_email)
  if (user_email) {
    const getUser = await db.select().from(users_schema).where(eq(users_schema.email, user_email));
    console.log('currentuser::', getUser[0]);
    return res.status(200).send(getUser[0])
  }
  res.send({ null: null })


})

// user profile management function ///
userRoute.post('/profile/management', verifyToken,
  upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'certificatImg', maxCount: 5 },]),
  async (req, res) => {
    const user = req.body;
    const verifyemail = req.email;
    const image = req.files;
    console.log('image::', image);
    const store = await db.update(users_schema).set({})
    res.send(user)

  })

  
// userRoute.post('/searchJobs', async (req, res) => {
//   try {
//     const query = req.query?.jobs;
//     console.log("Search query:", query);

//     const API_KEY = process.env.GOOGLE_SERACHING_API_KEY;
//     const CX = process.env.GOOGLE_SERACH_ENGINE_ID;

//     const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
//       params: { key: API_KEY, cx: CX, q: query, num: 10, sort: "date" },
//     });

//     const rawResults = response.data.items || [];

//     const jobsToInsert = rawResults.map(item => ({
//       title: item.title,
//       link: item.link,
//       snippet: item.snippet,
//       image: item.pagemap?.cse_image?.[0]?.src || ""
//     }));

//     const JobStore = await db.insert(Joblist).values(jobsToInsert).returning();

//     console.log("Inserted Jobs:", JobStore);
//     res.status(201).json({ message: "Jobs stored successfully", data: JobStore });

//   } catch (error) {
//     console.error("Error inserting jobs:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// userRoute.get('/getJob',async(req,res)=>{
//   // console.log('hello world get job find')
//    const jobList = await db.select().from(Joblist);
//   console.log("get joblist ::",jobList)
//   res.status(200).send(jobList)
// })


//--------------search by category------------------------//
// userRoute.get('/category',async(req,res)=>{
//  const category= req.query.category;
//  const API_KEY = process.env.GOOGLE_SERACHING_API_KEY;
//   const CX = process.env.GOOGLE_SERACH_ENGINE_ID;
//   const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
//     params: {
//       key: API_KEY,
//       cx: CX,
//       q:category,
//       num:10,
//       sort: "date"
//     },
//   });

//  res.send(response.data)
// })

export default userRoute;