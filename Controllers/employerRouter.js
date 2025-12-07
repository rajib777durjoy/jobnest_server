
import express from "express";
import { employerVerify } from "./Token/verifyUser.js";
import db from "../lib/psqlDB.js";
import { AppliedList, JobCollection } from "../Model/schema.js";
import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import verifyToken from "./Token/verifyToken.js";

const employerRoute = express.Router();

employerRoute.get('/queryRecentJobs/:email', verifyToken, employerVerify, async (req, res) => {
    const { email } = req.params;
    const vefiyEmail = req.email;
    if (email !== vefiyEmail && !email) {
        return res.status(403).send({ message: 'Forbiden Access' })
    }
    const queryJob = await db.select().from(JobCollection).where(eq(JobCollection.email, email)).orderBy(desc(JobCollection.createdAt)).limit(6);
    // console.log(queryJob);
    res.status(200).send(queryJob)
})

employerRoute.patch('/changeActivity/:id/:active', verifyToken, employerVerify, async (req, res) => {
    const { id, active } = req.params;
    // console.log(id, active)
    const updateAcitivity = await db.update(JobCollection).set({ activity: active }).where(eq(JobCollection.Job_id, id));
    // console.log('update', updateAcitivity)
    res.status(200).send({ message: 'updateSuccessfull' })
})

// Get Applylist by search user email //
employerRoute.get('/applyJoblist/:email', verifyToken, employerVerify, async (req, res) => {
    const { email } = req.params;
    const vefiyEmail = req.email;
    if (email !== vefiyEmail && !email) {
        return res.status(403).send({ message: 'Forbiden Access' })
    }
    const applylist = await db.select().from(AppliedList).where(eq(AppliedList.ownerEmail, email));
    res.status(200).send(applylist);
})

employerRoute.get('/JobApplyList/:email', verifyToken, employerVerify, async (req, res) => {
    const { email } = req.params;
    const verityEmail = req.email;
    if (verityEmail !== email && !email) {
        return res.status(403).send({ message: 'Forbidden Access' })
    }
    const applyList = await db.select().from(AppliedList).where(eq(AppliedList.ownerEmail, email))
    res.status(200).send(applyList)
})

employerRoute.get('/applyJobDetails/:id', async (req, res) => {
    const { id } = req.params;
    const data = await db.select().from(AppliedList).where(eq(AppliedList.Apply_id, id));
    res.status(200).send(data);
})

employerRoute.patch('/updateStatus/:status/:apply_id', verifyToken, employerVerify, async (req, res) => {
    const { status, apply_id } = req.params;
    // console.log(status, apply_id);
    const update = await db.update(AppliedList).set({ status }).where(eq(AppliedList.Apply_id, apply_id))
    res.status(200).send({ message: 'update successfull' })
})
employerRoute.patch('/updateStatus/:apply_id/:Job_id', async (req, res) => {
    const { apply_id, Job_id } = req.params;
    const status = req.query.status;
    if (status === 'Reject') {
        const remove = db.delete(AppliedList).where(eq(AppliedList.Apply_id, Number(apply_id))).returning()
        const updateApplyCount = db.update(JobCollection).set({ applyCount: sql`${JobCollection.applyCount} - 1` }).where(eq(JobCollection.Job_id, Number(Job_id))).returning()
        return res.status(200).send({ message: 'Reject successfull' })
    }
    const statusUpdate = await db.update(AppliedList).set({ status: status }).where(eq(AppliedList.Apply_id, Number(apply_id))).returning();
    res.status(200).send({ message: 'update successfull' })
})
employerRoute.delete('/applyjobRemove/:id', verifyToken, employerVerify, async (req, res) => {
    const { id } = req.params;
    const remove = await db.delete(AppliedList).where(eq(AppliedList.Apply_id, id)).returning();
    const applyCountRemove = await db.update(JobCollection).set({ applyCount: sql`${JobCollection.applyCount} - 1` }).where(eq(JobCollection.Job_id, remove[0].Job_id))
    res.status(200).send({ message: 'delete successfull' })
})

// find job using email by group ///
employerRoute.get('/Joblist', verifyToken, employerVerify, async (req, res) => {
    const email = req.email;

    const search = (req.query.search || "").trim().toLowerCase();
    const filter = (req.query.filter || "").trim().toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;


    let query = db
        .select()
        .from(JobCollection)
        .where(eq(JobCollection.email, email));

    // Apply search filter only if search text exists
    if (search.length > 0) {
        query = db
            .select()
            .from(JobCollection)
            .where(
                and(
                    eq(JobCollection.email, email),
                    or(
                        sql`${JobCollection.JobTitle} ILIKE ${`%${search}%`}`,
                        sql`${JobCollection.companyName} ILIKE ${`%${search}%`}`,
                        sql`${JobCollection.location} ILIKE ${`%${search}%`}`,
                        sql`${JobCollection.JobType} ILIKE ${`%${search}%`}`,
                        sql`${JobCollection.working_time} ILIKE ${`%${search}%`}`
                    )
                )
            );
    }
    switch (filter) {
        case 'experience-high':
            query = query.orderBy(JobCollection.experience, 'desc');
            break;
        case 'experience-low':
            query = query.orderBy(JobCollection.experience, 'asc');
            break;
        case 'company-az':
            query = query.orderBy(JobCollection.companyName, 'asc');
            break;
        case 'company-za':
            query = query.orderBy(JobCollection.companyName, 'desc');
            break;
        case 'recent':
            query = query.orderBy(JobCollection.createdAt, 'desc');
            break;
        case 'oldest':
            query = query.orderBy(JobCollection.createdAt, 'asc');
            break;
        case 'title-az':
            query = query.orderBy(JobCollection.JobTitle, 'asc');
            break;
        case 'title-za':
            query = query.orderBy(JobCollection.JobTitle, 'desc');
            break;
        case 'remote':
            query = query.where(eq(JobCollection.JobType, 'Remote'));
            break;
        case 'onsite':
            query = query.where(eq(JobCollection.JobType, 'Onsite'));
            break;
        case 'hybrid':
            query = query.where(eq(JobCollection.JobType, 'Hybrid'));
            break;
    }
    // Pagination applied in query
    query = query.limit(limit).offset(offset);

    const result = await query;
    const totalCountQuery = await db
        .select({ count: sql`COUNT(*)` })
        .from(JobCollection)
        .where(eq(JobCollection.email, email));

    const totalCount = parseInt(totalCountQuery[0].count);

    res.status(200).send({
        data: result,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
    });


});

// remove job //
employerRoute.delete('/remove_job/:id',verifyToken,employerVerify, async (req, res) => {
    const { id } = req.params;
    const remove = await db.delete(JobCollection).where(eq(JobCollection.Job_id, id)).returning();
    if (remove.length === 0) {
        return res.status(500).send({ message: 'delete Unsuccessful' })
    }
    res.status(200).send({ message: 'delete successfull' });
});



export default employerRoute;