import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId, required: true },
    video: { type: String },
    whiteboard: { type: String },
    isOpen: { type: Boolean, default: false },
    activeUsers: {
        type: [{
            user: { type: mongoose.Types.ObjectId, ref: "User", required: true, unique: false },
            peerId: { type: String, required: true },
            socketId: { type: String, required: true },
            joinedAt: { type: Date, default: Date.now },
        }],
        default: []
    },
    logs: [{
        sender: {
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            },
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        }
    }],

}, { timestamps: true });

interface ILesson {
    _id: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    video?: string;
    whiteboard?: string;
    isOpen?: boolean;
    activeUsers?: Array<{
        user: mongoose.Types.ObjectId;
        peerId: string;
        socketId: string;
        joinedAt?: Date;
    }>;
    logs?: Array<{
        sender: {
            id: string;
            username: string;
        };
        content: string;
        createdAt: Date;
    }>;
    createdAt?: Date;
    modifiedAt?: Date;
}

const LessonModel = mongoose.model("Lesson", LessonSchema);

export { LessonModel, ILesson };
