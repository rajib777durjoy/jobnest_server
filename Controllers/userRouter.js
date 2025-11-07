
import express from "express";
import verifyToken from "./Token/verifyToken.js";
import db from "../lib/psqlDB.js";
import users_schema, { Joblist } from "../Model/schema.js";
import { eq } from "drizzle-orm";
import { upload } from "./multer.js";
import axios from "axios";


const userRoute = express.Router()

userRoute.get('/currentUser', verifyToken, async (req, res) => {
  const user_email = req.email;
  // console.log(user_email)
  const getUser = await db.select().from(users_schema).where(eq(users_schema.email, user_email));
  // console.log('currentuser::', getUser[0]);
  res.status(200).send(getUser[0])

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

userRoute.post('/searchJobs', async (req, res) => {
  try {
    const query = req.query?.jobs;
    console.log("Search query:", query);

    const API_KEY = process.env.GOOGLE_SERACHING_API_KEY;
    const CX = process.env.GOOGLE_SERACH_ENGINE_ID;

    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: { key: API_KEY, cx: CX, q: query, num: 10, sort: "date" },
    });

    const rawResults = response.data.items || [];

    const jobsToInsert = rawResults.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      image: item.pagemap?.cse_image?.[0]?.src || ""
    }));

    const JobStore = await db.insert(Joblist).values(jobsToInsert).returning();

    console.log("Inserted Jobs:", JobStore);
    res.status(201).json({ message: "Jobs stored successfully", data: JobStore });

  } catch (error) {
    console.error("Error inserting jobs:", error.message);
    res.status(500).json({ error: error.message });
  }
});

userRoute.get('/getJob',async(req,res)=>{
  // console.log('hello world get job find')
   const jobList = await db.select().from(Joblist);
  console.log("get joblist ::",jobList)
  res.status(200).send(jobList)
})


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