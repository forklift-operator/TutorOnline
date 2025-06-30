import { ConnectOptions } from './../../node_modules/mongodb/src/sdam/topology';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserDTO } from '../../../client/src/dtos/userDTO';

dotenv.config();

const URI = process.env.ATLAS_URI || "";

let db: mongoose.Connection;

async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(URI);

        console.log("Connected to MongoDB");

        db = mongoose.connection;
    } catch (e) {
        console.error("Failed to connect to MongoDB:", (e as Error).message);
        process.exit(1);
    }
}

export { db, connectDB };