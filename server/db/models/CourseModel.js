import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    description:{ type: String },
    video:{ type: String },
    whiteboard:{ type: String },
    isOpen:{ type: Boolean, default: false },
    activeUsers:[{
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        peerId: { type: String, required: true },
        socketId: { type: String, required:true },
        joinedAt: { type: Date, default: Date.now },
    }],
    logs:[{
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
        date: {
            type: Date,
            required: true,
            default: Date.now,
        }
    }],
    
});


const CourseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    lessons: {type: [LessonSchema], default: []},
    
})

const CourseModel = mongoose.model('Course', CourseSchema);

export { CourseModel };