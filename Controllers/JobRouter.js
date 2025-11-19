
import express from "express";
import db from "../lib/psqlDB.js";
import users_schema, { AppliedList, JobCollection, SaveJobs } from "../Model/schema.js";
import verifyToken from "./Token/verifyToken.js";
import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { upload } from "./multer.js";
import fs from "fs"
import imagekit from "./Imagekit/imagekit.js";

const JobRouter = express.Router()

// Add job function allow for Employer not for Candidate //

JobRouter.post('/Jobpost', verifyToken, async (req, res) => {
  const email = req.email;
  const data = req.body;
  const JobData = { ...data, email };
  // console.log("data list", JobData);
  const StoreJobData = await db.insert(JobCollection).values(JobData).returning();
  //  console.log("StoreJobData",StoreJobData)
  res.send(StoreJobData)
});

JobRouter.get('/Joblist', async (req, res) => {
  const query = await db.select().from(JobCollection);
  //  console.log('query',query);
  res.status(200).send(query);
})

// single job details ///
JobRouter.get('/details/:id', async (req, res) => {
  const Job_id = req.params.id;
  // console.log(Job_id);
  const query = await db.select().from(JobCollection).where(eq(JobCollection?.Job_id, Job_id));
  // console.log('details query::', query)
  res.send(query)
})

JobRouter.post('/JobSubmitForm', verifyToken, upload.single("resume"), async (req, res) => {
  const data = req.body;
  const files = req.file;
  const userEmail = req.email;

  const checkApply = await db.select().from(AppliedList).where(and(eq(AppliedList.Job_id, data.Job_id), eq(AppliedList.email, userEmail)));

  if (checkApply.length > 0) {
    return res.status(200).send({ message: 'You already applied this position' })
  }

  // convert resume file  using multer and imagekit ///
  if (!files) {
    return res.status(500).send({ message: 'file is not found !' })
  }
  const filePath = fs.readFileSync(files.path);
  const result = await imagekit.upload({
    file: filePath,
    fileName: files.originalname,
  });
  fs.unlinkSync(files.path)
  // console.log('resume::',result.url)
  if (!result.url) {
    return res.status(500).send({ message: 'image url is not found !' })
  }

  const ApplyData = { ...data, resume: result.url }
  // store applyData in psql database using drizzle.orm //
  const store = await db.insert(AppliedList).values(ApplyData).returning()
  // console.log('drizzle response::', store)
  res.status(200).send({ success: 'Apply Successfull' });
})

//--------------- Recent Job -------------//
JobRouter.get('/Apply_jobs/:email', async (req, res) => {
  const email = req.params.email;
  // console.log("email:", email);
  const Jobs = await db.select().from(AppliedList).where(eq(AppliedList?.email, email)).orderBy(desc(AppliedList?.createdAt)).limit(6);
  // console.log('recent jobs::', Jobs)
  res.status(200).send(Jobs);
})

// ------------ Apply_id join to job_id for get Job Details --------------//
JobRouter.get('/applyDetails/:id', async (req, res) => {
  const id = Number(req.params.id); // convert param to number
  const Details = await db.select().from(AppliedList).where(eq(AppliedList.Apply_id, id));
  // console.log('details:::', Details)
  res.send(Details)

})

// ------------------ Query for relevant Jobs -------------------//
JobRouter.get('/relevantJobs',verifyToken,async(req,res)=>{
  const email= req.email;
  const userInfo= await db.select().from(users_schema).where(eq(users_schema.email,email));
  const title=(userInfo[0].title).split(',');

  const Jobs = await db
  .select()
  .from(JobCollection)
  .where(inArray(JobCollection.JobTitle, title));
  console.log(Jobs)
  res.status(200).send(Jobs)

})

// Save Jobs related api functionality ///
JobRouter.post('/savejob/:id',async(req,res)=>{
  const id=Number(req.params?.id);
 const query = await db.select().from(SaveJobs).where(eq(SaveJobs?.Job_id,id));
 console.log('save job query::',query)
 if(query.length > 0){
  return res.status(500).send({message:'This job already saved'})
 };
 const saveJob= await db.insert(SaveJobs).values({Job_id:id}).returning()
 res.send(saveJob)
})


export default JobRouter;