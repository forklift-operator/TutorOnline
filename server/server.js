import express, { query } from "express"
import cors from 'cors'
import { AuthRouter } from "./routes/auth/authentication.js" 
import { AdminRouter } from "./routes/user_management/admin_managed.js";
import { SignedRouter } from "./routes/user_management/singned_managed.js";
import { db, connectDB } from './db/connect.js'
import { connectIO } from "./sockets.js";
import http from "http"
import { verifyToken, checkRole } from "./middleware/authorisation.js";

import { CourseRouter } from "./routes/room_management/room_management.js";

const port = 8080;

const corsOptions = {
    origin:"*",
    credentials: true
}
connectDB();

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
app.use("/api", AuthRouter)
app.use("/api", AdminRouter);
app.use("/api", SignedRouter);
app.use("/api", CourseRouter)

const server = http.createServer(app);

connectIO(server);

server.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);  
})
