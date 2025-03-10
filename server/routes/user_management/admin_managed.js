import { Router } from "express";
import { ObjectId } from "mongodb";
import { verifyToken, checkRole } from "../../middleware/authorisation.js";
import { db } from "../../db/connect.js";

const AdminRouter = Router();

AdminRouter.get("/users", verifyToken, checkRole("Admin"), async (req, res) => {

    const collections = await db.collection("users"); 
    const result = await collections.find({}).toArray(); 
    res.send(result).status(200);
    
})

AdminRouter.put("/users/:id", verifyToken, checkRole("Admin"), async (req, res) => {
    const collections = await db.collection("users");
    const query = { _id: new ObjectId(req.params.id) };
    const {username, email, role, ...other} = req.body;

    const user = await collections.findOne(query);
    const newVals = {
        $set:{
            username: username || user.username, 
            email: email || user.email, 
            role: role || user.role,
            ...other,
        }
    };

    collections.updateOne(query, newVals, async (e, r) => {
        if (e || r.updatedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const updated = await collections.findOne(query);
        res.status(200).json({updated});
    });

})

AdminRouter.delete("/users/:id", verifyToken, checkRole("Admin"), async (req, res) => {
    const collection = db.collection("users");
    const query = { _id: new ObjectId(req.params.id) };

    await collection.deleteOne(query, (e, r) => {
        if (e || r.deletedCount === 0) {
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json({ message: "Successful deletion"});
    });
})

export {AdminRouter};