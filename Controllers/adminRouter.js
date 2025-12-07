
import express from "express";
import { adminVerify } from "./Token/verifyUser.js";
import db from "../lib/psqlDB.js";
import users_schema, { AppliedList, JobCollection } from "../Model/schema.js";
import verifyToken from "./Token/verifyToken.js";
import { and, desc, eq, ne } from "drizzle-orm";

const adminRouter = express.Router();

//Get All user list for admin page //
adminRouter.get('/usersList/:email', verifyToken, adminVerify, async (req, res) => {
  const email = req.params.email;
  const verifEmail = req.email;
  if (email !== verifEmail) {
    return res.status(403).send({ message: 'Invalid user access' })
  }
  const query = await db.select().from(users_schema).where(ne(users_schema.email, email))
  // console.log('query::', query)
  res.send(query)
})

// User Delete related api //
adminRouter.delete('/userRemove/:id',async(req,res)=>{
  const {id} = Number(req.params);
  // console.log(id , typeof id);
  if(!id){
    return res.status(500).send({message:'user id is undefind'})
  }
  const remove_user= await db.delete(users_schema).where(eq(users_schema.id,id)).returning();
  // console.log(remove_user);
  res.status(200).send({message:'successfull'})
})

adminRouter.get('/singleUser/:id', async (req, res) => {
  const id = Number(req.params.id);
  // console.log(id);
  const singleUser = await db.select().from(users_schema).where(eq(users_schema.id, id));
  // console.log(singleUser);
  res.status(200).send(singleUser[0]);

})


adminRouter.get('/postjobs', verifyToken, adminVerify, async (req, res) => {
  const email = req.email;

  // console.log("email:", email);
  const Jobs = await db
    .select()
    .from(JobCollection)
    .where(
      and(
        ne(JobCollection.status, 'Reject'),  
        ne(JobCollection.email, email)  
      )
    )
    .orderBy(desc(JobCollection.createdAt))
    .limit(6);
  // console.log('recent jobs::', Jobs)
  res.status(200).send(Jobs);
})

adminRouter.get('/JobDetails/:id',async(req,res)=>{
  const {id} = req.params;
  const singleJob= await db.select().from(JobCollection).where(eq(JobCollection.Job_id,id));
  // console.log("singleJob:::",singleJob);
  res.status(200).send(singleJob)
})

adminRouter.get('/Alljob',verifyToken,adminVerify,async(req,res)=>{
  const email= req.email;
  const Jobs= await db.select().from(JobCollection).where(ne(JobCollection?.email,email));
  // console.log(Jobs);
  res.status(200).send(Jobs);
})

adminRouter.patch('/update_status/:Job_id', verifyToken, adminVerify, async (req, res) => {
  const Job_id = req.params?.Job_id;
  const status = req.query.status;
  // console.log(status, Job_id);
  if (status === "" && Job_id === 0) {
    return res.status(500).send({ message: 'status or Job_id Undifind ! please check your status and Job_id' })
  }
  const update_status = await db.update(JobCollection).set({ status}).where(eq(JobCollection?.Job_id, Job_id));
  // console.log("update status successfull::", update_status)
  
  res.send({ message: 'update successfull' })

})

adminRouter.delete('/JobDelete/:Job_id',verifyToken,adminVerify,async(req,res)=>{
  const email = req.body?.email;
  const verifyemail= req.email;
  const Job_id = Number(req.params?.Job_id);
  // console.log('id and email::',Job_id, email)
  if(email !== verifyemail){
    return res.status(403).send({message:'Unauthorize Access !'})
  }
  const deleteJob= await db.delete(JobCollection).where(eq(JobCollection.Job_id,Job_id)).returning()
  // console.log('deleted job::',deleteJob)
    if (!deleteJob.length) {
      return res.status(404).send({ message: 'Job not found' });
    }
   res.status(200).send({ message: "Job deleted successfully"});
})

adminRouter.get('/applications',verifyToken,adminVerify,async(req,res)=>{
  const email = req.email;
  const applicationList= await db.select().from(AppliedList).where(ne(AppliedList.email,email)).orderBy(desc(AppliedList.createdAt)).limit(6);
  // console.log('applications::',applicationList)
  res.status(200).send(applicationList);
})

export default adminRouter;