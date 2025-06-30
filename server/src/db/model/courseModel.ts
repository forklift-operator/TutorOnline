import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    imgUrl: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    lessons: [{ type: Schema.Types.ObjectId }],
    currentLessonUrl: { type: String }
}, { timestamps: true })

interface ICourse {
    _id: mongoose.Types.ObjectId;
    name: string;
    teacher: mongoose.Types.ObjectId;
    description: string;
    imgUrl?: string;
    rating?: number;
    students?: mongoose.Types.ObjectId[];
    lessons?: mongoose.Types.ObjectId[];
    currentLessonId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    modifiedAt?: Date;
}

const CourseModel = mongoose.model('Course', CourseSchema);

export { CourseModel, ICourse };