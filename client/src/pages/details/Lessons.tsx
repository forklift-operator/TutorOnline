import type { ILesson } from "../../../../server/src/db/model/lessonModel"
import LessonCard from "@/components/cards/LessonCard";

type Props = {
    lessons: ILesson[],
    className?: string,
    onStartMeet?: (id: string) => Promise<void>,
    owner: boolean,
    onDeleteLesson: (id: string) => Promise<void>,
}

export default function Lessons({ lessons, className, onStartMeet, onDeleteLesson, owner }: Props) {

  return (
    <div className="w-full h-full mt-5 overflow-y-auto ">
        {lessons.map(lesson => {
            return (
                <LessonCard 
                    key={lesson._id.toString()} 
                    lesson={lesson} 
                    className={className}
                    onStartMeet={onStartMeet}
                    onDeleteLesson={onDeleteLesson}
                    owner={owner}
                />
            )
        })}
    </div>
  )
}
