import { Router } from "express";
import { ObjectId } from "mongodb";
import { verifyToken, checkRole } from "../../middleware/authorisation.js";
import { db } from "../../db/connect.js";

const SignedRouter = Router();


SignedRouter.get("/users/:id", verifyToken, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    const collections = db.collection("users");
    const query = {_id: new ObjectId(req.params.id)}
    const result = await collections.findOne(query);

    if(!result) res.send("Not found").status(404);
    res.status(200).json(result);
})

SignedRouter.get("/teachers", async (req, res) => {
    const collections = db.collection("users");
    const query = {role: "Teacher"};
    const options = {
        projection: {
            username: 1,
            email: 1,
            role: 1,
            createdAt: 1,
        }
    }
    const result = await collections.find(query,options).toArray();

    res.status(200).json(result);
})

SignedRouter.get("/teachers/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    const collections = db.collection("users");
    const query = {_id: new ObjectId(req.params.id)}
    const options = {
        username: 1,
        email: 1,
        role: 1,
        createdAt: 1,
    }
    const result = await collections.findOne(query, options);

    if(!result) res.json({message: "Not found"}).status(404);
    if(result.role != "Teacher") res.json({message: "User is not a teacher"}).status(404);
    res.status(200).json(result);
})


export {SignedRouter};