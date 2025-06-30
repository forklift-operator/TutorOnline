import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    imageURL: { type: String },
    roles: { type: [String], required: true }
}, { timestamps: true });

interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    username: string;
    bio?: string;
    password: string;
    email: string;
    imageUrl?: string;
    roles: string[];
    createdAt?: Date;
}

const UserModel = mongoose.model('User', UserSchema);

export { IUser, UserModel }