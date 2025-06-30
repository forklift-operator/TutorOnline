import express from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import http from 'http';

import { authRouter } from './routes/auth/authRouter'
import adminRouter from './routes/signed/adminRouter';
import userRouter from './routes/signed/userRouter'
import { connectDB } from './db/connect';
import { connectIO } from './sockets';

dotenv.config();

connectDB();

const PORT = 8080;

const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api', adminRouter);
app.use('/api', userRouter);

const server = http.createServer(app);

connectIO(server);

server.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`);  
})