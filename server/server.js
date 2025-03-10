import express from "express"
import { AuthRouter } from "./routes/auth/authentication.js" 
import { AdminRouter } from "./routes/user_management/admin_managed.js";
import { SignedRouter } from "./routes/user_management/singned_managed.js";
import { db, connectDB } from './db/connect.js'
import http from "http"
// import { verifyToken, checkRole } from "./middleware/authorisation.js";

const port = 8080;


connectDB();

const app = express();
app.use(express.json())
app.use("/api", AuthRouter)
app.use("/api", AdminRouter);
app.use("/api", SignedRouter);

const server = http.createServer(app);




server.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);  
})
