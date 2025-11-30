
import express from "express";
import { employerVerify } from "./Token/verifyUser.js";
import db from "../lib/psqlDB.js";
import { AppliedList, JobCollection } from "../Model/schema.js";
import { desc, eq } from "drizzle-orm";
import verifyToken from "./Token/verifyToken.js";

const employerRoute = express.Router();

employerRoute.get('/queryRecentJobs/:email', verifyToken, employerVerify, async (req, res) => {
    const { email } = req.params;
    const vefiyEmail= req.email;
    if (email !== vefiyEmail && !email) {
        return res.status(403).send({ message: 'Forbiden Access' })
    }
    const queryJob = await db.select().from(JobCollection).where(eq(JobCollection.email,email)).orderBy(desc(JobCollection.createdAt)).limit(6);
    console.log(queryJob);
    res.status(200).send(queryJob)
})

employerRoute.patch('/changeActivity/:id/:active', verifyToken, employerVerify, async (req, res) => {
    const { id, active } = req.params;
    console.log(id, active)
    const updateAcitivity = await db.update(JobCollection).set({ activity: active }).where(eq(JobCollection.Job_id, id));
    console.log('update', updateAcitivity)
    res.status(200).send({ message: 'updateSuccessfull' })
})

// Get Applylist by search user email //
employerRoute.get('/applyJoblist/:email',verifyToken,employerVerify,async(req,res)=>{
    const {email}= req.params;
    const vefiyEmail= req.email;
    if (email !== vefiyEmail && !email) {
        return res.status(403).send({ message: 'Forbiden Access' })
    }
    const applylist = await db.select().from(AppliedList).where(eq(AppliedList.ownerEmail,email));
    res.status(200).send(applylist);
}) 

employerRoute.get('/JobApplyList/:email', verifyToken, employerVerify, async (req, res) => {
    const { email } = req.params;
    const verityEmail = req.email;
    if(verityEmail !== email && !email){
       return res.status(403).send({message:'Forbidden Access'}) 
    }
    const applyList = await db.select().from(AppliedList).where(eq(AppliedList.ownerEmail,email))
    res.status(200).send(applyList)
})

employerRoute.get('/applyJobDetails/:id',async(req,res)=>{
    const {id}= req.params;
    const data = await db.select().from(AppliedList).where(eq(AppliedList.Apply_id,id));
    res.status(200).send(data);
})

employerRoute.patch('/updateStatus/:status/:apply_id',verifyToken,employerVerify,async(req,res)=>{
    const {status,apply_id} = req.params;
    console.log(status,apply_id);
    const update = await db.update(AppliedList).set({status}).where(eq(AppliedList.Apply_id,apply_id))
    res.status(200).send({message:'update successfull'})
})

employerRoute.delete('/applyjobRemove/:id',async(req,res)=>{
const {id} = req.params;
const remove = await db.delete(AppliedList).where(eq(AppliedList.Apply_id,id)).returning();
res.status(200).send({message:'delete successfull'})
})


export default employerRoute;