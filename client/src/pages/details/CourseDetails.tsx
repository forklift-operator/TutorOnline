import { useParams } from "react-router"
import type { ILesson } from "../../../../server/src/db/model/lessonModel";
import type { ICourse } from "../../../../server/src/db/model/courseModel";
import { useEffect, useState } from "react";
import { defaultCourseImg } from "@/common/commonTypes";
import { Label } from "@radix-ui/react-label";
import { CreateLessonModal } from "@/components/misc/CreateLessonModal";
import Lessons from "./Lessons";
import type { IUser } from "../../../../server/src/db/model/userModel";
import Cookies from "js-cookie";
import { UpdateCourseModal } from "@/components/misc/UpdateCourseModal";

type Props = { 
    onFetchCourse: (entityType: string, id: string) => Promise<ICourse>,
    onFetchLessons: (entityType: string, filter?: Record<string, any>) => Promise<ILesson[]>,
    onUpdateCourse?: (entityType: string, updated: ICourse) => Promise<ICourse>,
    onCreateLesson: (entityType: string, entity: Omit<ILesson, '_id'>) => Promise<ILesson>,
    onDeleteLesson: (entityType: string, id: string) => Promise<ILesson>,
    onStartMeet?: (id: string) => Promise<void>;
}

export default function CourseDetails({ onFetchCourse, onFetchLessons, onUpdateCourse, onCreateLesson, onDeleteLesson, onStartMeet}: Props) {
    const { id } = useParams<string>();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [lessons, setLessons] = useState<ILesson[]>([])
    const [loading, setLoading] = useState(true);
    
    const [owner, setowner] = useState(false)
    const myId = (JSON.parse(Cookies.get('user') || '') as IUser)._id;

    const createLesson = async (lesson: Omit<ILesson, '_id'>) => {
        try {
            const newLesson = await onCreateLesson('lesson', lesson);
            setLessons(prevLessons => [...prevLessons, newLesson]);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const deleteLesson = async (lessonId: string) => {
        try {
            const newLesson = await onDeleteLesson('lesson', lessonId);
            setLessons(lessons.filter(lesson => lesson._id.toString() !== lessonId ));
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const updateCourse = async (updatedCourse: ICourse) => {
        try {
            if (!onUpdateCourse) return;
            const updated = await onUpdateCourse('course', updatedCourse);  
            setCourse(updated);
        } catch (e) {
            console.error((e as Error).message);
        }
    }
    
    const fetchCourse = async () => {
        try {
            
            const course = await onFetchCourse('course', id!)
            if (course) {
                setowner(myId.toString() === course.teacher.toString())
                setCourse(course);
            }
        } catch (e) {
            console.error((e as Error).message);
        } finally {
            setLoading(false);
        }


    }

    const fetchLessons = async () => {
        try {
            const lessons = await onFetchLessons('lesson', {courseId: course!._id.toString()})
            setLessons(lessons);         
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [])

    useEffect(() => {
        if (!course) return;
        fetchLessons();
    }, [course])

    
    if (loading) {
        return <h1>Loading...</h1>
    }
    
    if (!course) {
        return <h1>Could not find the course you're looking for</h1>
    }
    
  return (
<div className="CourseDetails flex flex-col w-full h-full overflow-hidden">
    {/* Image Header */}
    <div className="relative w-full h-[20%] bg-red-100">
        <img src={course.imgUrl} alt="IMAGE" 
            onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = defaultCourseImg;
            }}
            className="w-full h-full object-cover brightness-40"
        />

        <h2 className="absolute flex items-center gap-5 bottom-0 left-0 text-[40px] md:text-[80px] font-bold text-white z-10 px-5 pb-4 leading-none">{course.name}</h2>

        {owner && onUpdateCourse &&
            <UpdateCourseModal className="absolute top-2 right-2 z-100 " course={course} onUpdateCourse={updateCourse}></UpdateCourseModal>
        }
        
    </div>

    {/* Course Body */}
    <div className="w-full flex flex-row gap-5 h-[600px] p-5">
            <div className="flex-3 flex flex-col w-2/3 text-pretty">
                <Label className="mb-2 text-lg">Description:</Label>
                <p>{course.description}</p>
            </div>

        <div className="w-px bg-gray-600" />
        
        <div className="flex-2 flex flex-col">
            <p className="text-3xl mb-3">Lessons</p>
            {owner &&
                <CreateLessonModal onCreateLesson={createLesson} courseId={course._id} teacherId={myId}/>
            }
            <Lessons className="bg-background " lessons={lessons} onStartMeet={onStartMeet} owner={owner} onDeleteLesson={deleteLesson}/>
        </div>
    </div>
    
</div>
)
}