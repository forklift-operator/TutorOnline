import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const URI = process.env.ATLAS_URI || "";


async function connectDB() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Connected to MongoDB");
        
        db = mongoose.connection;
        
        return db;
    } catch (e) {
        console.error("Failed to connect to MongoDB:", e);
        process.exit(1); 
    }
}

let db = mongoose.connection;

export { db, connectDB };