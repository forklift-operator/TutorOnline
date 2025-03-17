import express from "express"
import cors from 'cors'
import { AuthRouter } from "./routes/auth/authentication.js" 
import { AdminRouter } from "./routes/user_management/admin_managed.js";
import { SignedRouter } from "./routes/user_management/singned_managed.js";
import { db, connectDB } from './db/connect.js'
import { Server } from "socket.io";
import http from "http"
import { verifyToken, checkRole } from "./middleware/authorisation.js";

const port = 8080;


connectDB();

const app = express();
app.use(cors());
app.use(express.json())
app.use("/api", AuthRouter)
app.use("/api", AdminRouter);
app.use("/api", SignedRouter);

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"] 
    },
})

io.on("connect", socket => {
    io.emit("receive_message", `${socket.id} connected!`)
    
    socket.on("send_message", (data) => {
        if(data === "asd"){
            console.log("inapropriate:", data);
            socket.disconnect();
        }
        io.emit("receive_message", data);
    });
})



server.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);  
})
