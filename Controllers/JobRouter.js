
import express from "express";
import db from "../lib/psqlDB.js";
import { JobCollection } from "../Model/schema.js";
import verifyToken from "./Token/verifyToken.js";
import { eq } from "drizzle-orm";

const JobRouter= express.Router()

// Add job function allow for Employer not for Candidate //

JobRouter.post('/Jobpost',verifyToken,async(req,res)=>{
    const email =req.email;
   const data= req.body;
   const JobData= {...data,email};
   console.log("data list",JobData);
 const StoreJobData= await db.insert(JobCollection).values(JobData).returning();
//  console.log("StoreJobData",StoreJobData)
res.send(StoreJobData)
});

JobRouter.get('/Joblist',async(req,res)=>{
 const query = await db.select().from(JobCollection);
//  console.log('query',query);
 res.status(200).send(query) ;
})

// single job details ///
JobRouter.get('/details/:id',async(req,res)=>{
    const Job_id= req.params.id;
    console.log(Job_id);
    const query =await db.select().from(JobCollection).where(eq(JobCollection?.Job_id,Job_id));
    console.log('details query::',query)
    res.send(query)
})


export default JobRouter;