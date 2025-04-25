import { Router } from "express";
import { verifyToken, checkRole } from "../../middleware/authorisation.js";
import { db } from "../../db/connect.js";
import { CourseModel } from "../../db/models/CourseModel.js";
import { ObjectId } from "mongodb";

const CourseRouter = Router();

CourseRouter.get("/teachers/:teacherId/courses", verifyToken, async (req, res) => {
    console.log("getting courses");

    try {
        let courses = [];
        if (req.params.teacherId) {
            courses = await CourseModel.find({ teacher: new ObjectId(req.params.teacherId) })
        }else {
            courses = await CourseModel.find({});
        }
        return res.status(200).json(courses);
    } catch (e) {
        return res.status(500).json({ error: "Error getting courses: " + e });
    }
})

CourseRouter.post("/courses", verifyToken, checkRole("Teacher"), async (req, res) => {
    try {
        const userCourses = await CourseModel.find({ teacher: new ObjectId(req.user.id) });
        
        if (userCourses.length >= 10) return res.status(401).json({ error: "Can't create more than 10 courses. Delete some!" });
            
        const course = new CourseModel(req.body);
        await course.save();
        res.status(200).json(course);
    } catch (e) {
        res.status(500).json({ error: "Failed to create course " + e.message });
    }
});

CourseRouter.delete("/courses/:id", verifyToken, checkRole("Teacher"), async (req, res) => {
    try {
        const course = await CourseModel.findById( req.params.id );
        if(!course) return res.status(404).json({ error: "Course not found" });
        if(req.user.id != course.teacher.toString()) return res.status(403).json({ error: "No permissions to this course" });
        
        await CourseModel.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: "Deleted course: " + req.params.id });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete course " + e.message });
    }
})

CourseRouter.post("/courses/:courseId/lessons", verifyToken, checkRole("Teacher"), async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });
        if (req.user.id != course.teacher.toString()) return res.status(403).json({ error: "No permissions to this course" });

        console.log(req.body);
        
        
        const lesson = {
            name: req.body.name,
            description: req.body.description,
        };

        course.lessons.push(lesson);
        await course.save();

        res.status(200).json({ message: "Lesson added successfully", lesson });
    } catch (e) {
        console.log(e.message);
        
        res.status(500).json({ error: "Failed to create lesson: " + e.message });
    }
});


CourseRouter.post("/courses/:courseId/lessons/:lessonId", verifyToken, async (req, res) => {
    if (!ObjectId.isValid(req.params.courseId) || !ObjectId.isValid(req.params.lessonId)) {
        return res.status(400).json({ error: "Course or lesson ID invalid" });
    }

    try {
        const course = await CourseModel.findById(req.params.courseId);
        if (!course) return res.status(400).json({ error: `Course(${req.params.courseId}) not found` });

        const lesson = course.lessons.find(lesson => lesson._id.toString() === req.params.lessonId);
        if (!lesson) return res.status(400).json({ error: `Lesson(${req.params.lessonId}) not found` });

        if (req.body.setOpen !== undefined) {
            if (req.user.role !== "Teacher" || req.user.id !== course.teacher.toString()) {
                return res.status(400).json({ error: "No permissions to modify this lesson" });
            }

            lesson.isOpen = req.body.setOpen; 
            await course.save();
            return res.status(200).json({ message: `Lesson ${req.body.setOpen ? "opened" : "closed"} successfully`, lesson });
        } else {
            if (!lesson.isOpen) {
                return res.status(400).json({ error: "Lesson is not open yet" });
            }

            return res.status(200).json(lesson);
        }
    } catch (e) {
        return res.status(500).json({ error: `Server error: ${e.message}` });
    }
});

export { CourseRouter }