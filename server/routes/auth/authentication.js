import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../db/models/Models.js';
import { verifyToken } from '../../middleware/authorisation.js';

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
    const {username, email, password, role} = req.body;
    if (!username || !password || !email) return res.status(400).json({ error: "Username, email, and password are required" });
    if (await User.findOne({username})) return res.status(400).json({ error: "Username taken" });
    if (await User.findOne({email})) return res.status(400).json({ error: "Email taken" });

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword, email, role});
        await newUser.save();
        const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role}, process.env.JWT_SECRET);
        res.status(200).json({ token , id: newUser.id, role: newUser.role });
    } catch(e) {
        res.status(400).json({ error: `Error registering user: ${e.message}` });
    }
})

AuthRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) return res.status(400).json({ error: "Invalid username or password" });
        
        try {
            const user = await User.findOne({ username });
            if (!user) return res.status(400).json({ error: "User not found" });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ error: "Incorrect password" });
            
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET);
            res.status(200).json({ token , id: user.id, role: user.role });
        } catch (e) {
            res.status(500).json({ error: `Error logging in: ${e.message}` });
        }
})

AuthRouter.post('/login-status', verifyToken, (req, res) => {
    res.status(200).json({
        username: req.user.username,
        role: req.user.role,
        id: req.user.id,
        logged: true,
    });
})

export {AuthRouter};