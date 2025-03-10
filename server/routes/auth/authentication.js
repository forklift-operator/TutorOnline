import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../db/models/User.js';


const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
    const {username, email, password, role} = req.body;
    if (!username || !password || !email) return res.status(400).send("Username and email are required");
    if (await User.findOne({username})) return res.status(403).send("Username taken");
    if (await User.findOne({email})) return res.status(403).send("Email taken");

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword, email, role});
        await newUser.save();
        const token = jwt.sign({username: newUser.username, role: newUser.role}, process.env.JWT_SECRET);
        res.status(201).json({token});
    } catch(e) {
        res.status(400).send("Error registering user" + e);
    }
})

AuthRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).send("Invalid username or password");
    
    try{
        const user = await User.findOne({ username });
        if(!user) return res.status(400).send("User " + username + " not found");  
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).send("Incorrect password"+user.password);
        
        const token = jwt.sign({username: user.username, role: user.role}, process.env.JWT_SECRET);
        res.status(200).json({token}); 
    } catch(e) {
        res.status(500).send('Error logging in: ' + e.message);
    }
})

export {AuthRouter};