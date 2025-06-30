import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from "express";
import { IUser, UserModel } from '../db/model/userModel';
import { CourseModel, ICourse } from '../db/model/courseModel';
import { ILesson, LessonModel } from '../db/model/lessonModel';
dotenv.config();

const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const auth_header = req.headers.authorization;
    if (!auth_header) {
        return res.status(401).json({ message: 'No access token' });
    }
    const access_token = auth_header.split(' ')[1];

    try {
        const user = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET!);

        try {
            const foundUser = await UserModel.findOne({ _id: (user as any)._id })

            req.cookies.user = foundUser.toObject();
            return next();

        } catch (e) {
            return res.status(403).json({ message: "Your privliges changed (maybe you were deleted)" })
        }

    } catch (e) {
        console.error(e.message);

        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) return res.status(401).json({ message: 'No refresh token' });

        try {
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!);
            const { exp, iat, ...user } = decoded as any;
            const new_access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });

            req.cookies.new_access_token = new_access_token;
            req.cookies.user = decoded;

            return next();
        } catch (e) {
            console.error(e);

            return res.status(403).json({ message: "Unauthorized" })
        }
    }
}

const checkRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction): any => {
    const user = req.cookies.user as IUser;
    if (!user.roles.some(uRole => roles.includes(uRole))) {
        return res.status(401).json({ message: 'Unauthorized role' });
    }
    return next();
}

const isOwner = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const courseId = req.body._id;
        if (!courseId) {
            return res.status(400).json({ message: "Missing course ID" });
        }

        const course: ICourse = await CourseModel.findById(courseId);
        req.cookies.course = course;
        if (!course) return res.status(403).json({ message: "Course not found" });
        
        if (course.teacher.toString() === (req.cookies.user as IUser)._id.toString()) return next()

        return res.status(403).json({ message: "Course is not yours" });
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const isOwnerLesson = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        
        const lessonId = req.body.id;
        if (!lessonId) {
            return res.status(400).json({ message: "Missing course ID" });
        }
        
        const lesson: ILesson = await LessonModel.findById(lessonId);
        if (!lesson) return res.status(403).json({ message: "Lesson not found" });
        
        if (lesson.teacherId.toString() === (req.cookies.user as IUser)._id.toString()) return next()

        return res.status(403).json({ message: "Lesson is not yours" });
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { validateToken, checkRole, isOwner, isOwnerLesson }