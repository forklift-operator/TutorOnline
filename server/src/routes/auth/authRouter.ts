import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../../../../client/src/dtos/userDTO';
import express from 'express'
import { checkRole, validateToken } from '../../middleware/validateToken';
import { IUser, UserModel } from '../../db/model/userModel';
import { Credentials } from '../../../../client/src/common/commonTypes';
import bcrypt from "bcrypt"
import { LessonModel } from '../../db/model/lessonModel';

const authRouter = express.Router();

authRouter.post('/login', async (req, res): Promise<any> => {


    const credentials: Credentials = req.body.credentials;
    try {
        // verify the user
        const foundUser = await UserModel.findOne({ username: credentials.username });
        if (!foundUser) return res.status(400).json({ message: 'Username incorrect' });
        const { password, ...user } = foundUser.toObject();
        const validPassword = await bcrypt.compare(credentials.password, password);
        if (!validPassword) return res.status(400).json({ message: 'Password incorrect' });

        // make tokens
        const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
        const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ user, access_token, refresh_token });
    } catch (e) {
        console.error(e);

        res.status(500).json({ message: `Internal error: ${(e as Error).message}` })
    }

}).post('/register', async (req, res): Promise<any> => {
    try {
        const user: IUser = req.body.user;

        if (!user.password || !user.username) return res.status(400).json({ message: 'No username or password provided' });

        // make the user
        const hashed_pass = await bcrypt.hash(user.password, 8);
        try {
            const new_user = await UserModel.create({ ...user, password: hashed_pass });
            const { password, ...readyUser } = new_user.toObject();

            // make tokens
            const refresh_token = jwt.sign(readyUser, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
            const access_token = jwt.sign(readyUser, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ user: readyUser, access_token, refresh_token });

        } catch (e) {
            console.error(e);
            // find the typeof err
            if (e.code === 11000) {
                return res.status(400).json({ message: `${Object.keys(e.keyValue)[0]} is already taken` })
            } else throw e;
        }

    } catch (e) {
        res.status(500).json({ message: `Internal error: ${(e as Error).message}` })
    }

}).post('/validate-token', validateToken, (req, res): any => {
    const access_token = req.cookies.new_access_token;

    return access_token !== 'undefined' ? res.status(200).json({ message: 'Token is valid', new_access_token: access_token }) : res.status(200).json({ message: 'Token is valid' });

}).post('/logout', (req, res): any => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    return res.status(200).json({ message: 'Logout successfull' })

}).post('/validate-meet', validateToken, checkRole(['student', 'admin']), async (req, res): Promise<any> => {
    
    try {
        if (!ObjectId.isValid(req.body.id)) return res.status(404).json({message: 'Lesson id not valid'});  
            
        const lesson = await LessonModel.findById(req.body.id);
        if (!lesson) return res.status(404).json({message: 'Lesson not found'});
        if (!lesson.isOpen) return res.status(400).json({message: 'Lesson not open by the teacher'});
        
        return res.status(200).json({});
    } catch (e) {
        console.error((e as Error).message);
        res.status(500).json({ message: (e as Error).message })
    }
})


export { authRouter };