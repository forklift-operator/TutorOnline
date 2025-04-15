import { Router } from "express";
import { ObjectId } from "mongodb";
import { verifyToken, checkRole } from "../../middleware/authorisation.js";
import { db } from "../../db/connect.js";

const AdminRouter = Router();

AdminRouter.get("/users", verifyToken, checkRole("Admin"), async (req, res) => {
    const collections = db.collection("users"); 
    const result = await collections.find({}).toArray(); 
    return res.status(200).json(result);
})

AdminRouter.put("/users/:id", verifyToken, checkRole("Admin"), async (req, res) => {
    const collections = db.collection("users");
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

    try{
        const result = await collections.updateOne(query, newVals)

        if (result.matchedCount === 0 || res.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const updated = await collections.findOne(query);
        return res.status(200).json({updated});
    } catch (e) {
        return res.status(500).json({ message: "Error updating user: ", e })
    }

})

AdminRouter.delete("/users/:id", verifyToken, checkRole("Admin"), async (req, res) => {
    const collection = db.collection("users");
    const query = { _id: new ObjectId(req.params.id) };

    try {
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Successful deletion" });
    } catch (e) {
        return res.status(500).json({ message: "An error occurred while deleting the user", error: e });
    }
})

AdminRouter.get("/reports", verifyToken, checkRole("Admin"), async (req, res) => {
    const collections = db.collection("reports");

    try {
        const reports = await collections.find({}).toArray();
        return res.status(200).json(reports);
    } catch (e) {
        return res.status(500).json({ message: "Error while fetching reports: ", e })
    }
})

AdminRouter.get("/reports/:user_id", verifyToken, checkRole("Admin"), async (req, res) => {
    
    try {
        if (!ObjectId.isValid(req.params.user_id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        
        const collections = db.collection("reports");
        const query = { toUser: new ObjectId(req.params.user_id) };

        const results = await collections.find(query).toArray();
        if (!results) return res.status(400).json({ message: "No reports for this user" })
        return res.status(200).json(results);
    } catch (e) {
        return res.status(500).json({ message: "An error occurred while fetching reports", e });
    }
})

AdminRouter.post("/reports/:report_id", async (req, res) => {
    const collections = db.collection("reports");
    const query = { _id: new ObjectId(req.params.report_id) };

    try {
        const result = await collections.deleteOne(query);
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Report not found" })
        }
        return res.status(200).json({ message: "Report successfully deleted" })
    } catch (e) {
        return res.status(500).json({ message: "Error deleting report:", e })
    }
})

export {AdminRouter};