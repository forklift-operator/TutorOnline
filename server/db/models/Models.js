import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["Student", "Teacher", "Admin", "Guest"],
        default: "Guest",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
})

const User = mongoose.model("user", UserSchema);

const ReviewSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        enum: [1,2,3,4,5],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Review = mongoose.model("Review", ReviewSchema);

const ReportSchema = new mongoose.Schema({
    toUser: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    fromUser: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Report = mongoose.model("Report", ReportSchema);

export {User, Review, Report};