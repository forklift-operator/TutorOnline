import express from 'express'
import { checkRole, validateToken } from '../../middleware/validateToken';
import { UserModel } from '../../db/model/userModel';
import { Request, Response, NextFunction } from 'express';

const adminRouter = express.Router();

adminRouter.get('/users', validateToken, checkRole(['admin']), async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const query = req.query.name as string;
        const filter = query ? { username: { $regex: query, $options: 'i' } } : {};
        const users = await UserModel.find(filter);
        return res.status(200).json(users);
    } catch (e) {
        return next(e);
    }
}).put('/users', validateToken, checkRole(['admin']), async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const updated = await UserModel.findByIdAndUpdate(req.body._id, req.body, { new: true });
        return res.status(200).json(updated);
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: 'Internal server error' });
    }

}).delete('/users/:userId', validateToken, checkRole(['admin']), async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.params.userId;
        const deleted = await UserModel.deleteOne({ _id: userId });
        if (deleted.deletedCount === 0) {
            return res.status(400).json({ message: "User doesn't exist" })
        }
        return res.status(200).json(deleted);
    } catch (e) {
        return next(e);
    }
})

export default adminRouter;