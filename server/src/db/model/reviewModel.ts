import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    content: { type: String, required: true },
    author: {type: mongoose.Types.ObjectId, required: true},
    owner: {type: mongoose.Types.ObjectId, required: true},
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

interface IReview {
    subject: string,
    content: string,
    author: mongoose.Types.ObjectId,
    owner: mongoose.Types.ObjectId,
    rating: number,
    createdAt?: Date,
}

const ReviewModel = mongoose.model('User', ReviewSchema);

export {ReviewModel, IReview}