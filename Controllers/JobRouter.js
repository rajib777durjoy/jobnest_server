
import express from "express";
import db from "../lib/psqlDB.js";
import { AppliedList, JobCollection } from "../Model/schema.js";
import verifyToken from "./Token/verifyToken.js";
import { and, eq } from "drizzle-orm";
import { upload } from "./multer.js";
import fs from "fs"
import imagekit from "./Imagekit/imagekit.js";
import multer from "multer";
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

JobRouter.post('/JobSubmitForm',verifyToken,upload.single("resume"),async(req,res)=>{
    const data= req.body;
    const files = req.file;
    const userEmail = req.email;
    
    const checkApply= await db.select().from(AppliedList).where(and(eq(AppliedList.Job_id,data.Job_id),eq(AppliedList.email,userEmail)));
    
    if(checkApply.length > 0){
      return res.status(200).send({message:'You already applied this position'})
    }
   
    // convert resume file  using multer and imagekit ///
    if(!files){
      return res.status(500).send({message:'file is not found !'})
    }
    const filePath = fs.readFileSync(files.path);
    const result = await imagekit.upload({
        file: filePath,
        fileName: files.originalname,
    });
    fs.unlinkSync(files.path)
    // console.log('resume::',result.url)
    if(!result.url){
        return res.status(500).send({message:'image url is not found !'})
    }

    const ApplyData={...data,resume:result.url}
    // store applyData in psql database using drizzle.orm //
    const store = await db.insert(AppliedList).values(ApplyData).returning()
    console.log('drizzle response::',store)
    res.status(200).send({success:'Apply Successfull'});
})


export default JobRouter;