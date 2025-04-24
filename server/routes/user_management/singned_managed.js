import { Router } from "express";
import { ObjectId } from "mongodb";
import { verifyToken, checkRole } from "../../middleware/authorisation.js";
import { db } from "../../db/connect.js";
import { User, Report } from "../../db/models/UserModels.js";

const SignedRouter = Router();


SignedRouter.get("/users/:id", verifyToken, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
        const collections = db.collection("users");
        const query = {_id: new ObjectId(req.params.id)}
        const options = { projection: { password: 0 } };
        const result = await collections.findOne(query, options);
    
        if(!result) return res.status(404).json( {message: "Not found"} );
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ message: "Error getting user:", e })
    }
})

SignedRouter.get("/teachers", verifyToken, async (req, res) => {
SignedRouter.get("/teachers", verifyToken, async (req, res) => {
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

    try {
        const result = await collections.find(query,options).toArray();
        if (!result) {
            return res.status(400).json({ message: "No teachers found" })
        }
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ message: "Error getting teachers:", e })
    }

})

SignedRouter.get("/teachers/:id", verifyToken, async (req, res) => {
SignedRouter.get("/teachers/:id", verifyToken, async (req, res) => {
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
    try {
        const result = await collections.findOne(query, options);
        if(!result) return res.json({message: "Not found"}).status(404);
        if(result.role != "Teacher") {
            return res.status(404).json({message: "User is not a teacher"});
        }
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ message: "Error getting teacher:", e })
    }

})


SignedRouter.post("/report", verifyToken, async (req, res) => {
    
    const {toUser, fromUser, subject, text} = req.body;
    if (!ObjectId.isValid(toUser) || !ObjectId.isValid(fromUser)) return res.status(400).json({ message: "Invalid ID" });

    if (toUser === fromUser) {
        return res.status(400).json({ message: "Can't report yourself" })
    }

    try {
        if( ! await User.findOne({ _id: new ObjectId(toUser) }) ) {
            return res.status(400).json({ message: "User not found" });
        }
        const report = new Report({toUser, fromUser, subject, text});
        await report.save(); 
        return res.status(200).json({ message: "Successfully reported" });
    } catch (e) {
        return res.status(500).json({ message: "Error reporting user", e })
    }
    
})


export {SignedRouter};