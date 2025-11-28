
import express from "express";
import { employerVerify } from "./Token/verifyUser.js";
import db from "../lib/psqlDB.js";
import { JobCollection } from "../Model/schema.js";
import { desc, eq } from "drizzle-orm";

const employerRoute = express.Router();

employerRoute.get('/queryRecentJobs/:id',employerVerify,async(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(403).send({message:'Forbiden Access'})
    }

    const queryJob= await db.select().from(JobCollection).where(eq(JobCollection.Job_id,id)).orderBy(desc(JobCollection.createdAt)).limit(6);
    console.log(queryJob);
    res.status(200).send(queryJob)
})


export default employerRoute;