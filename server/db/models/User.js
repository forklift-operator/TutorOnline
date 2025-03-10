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
        enum: ["Student", "Teacher", "Admin"],
        default: "Student",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const User = mongoose.model("user", UserSchema);

export {User}