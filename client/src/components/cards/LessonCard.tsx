import { useNavigate } from "react-router";
import type { ILesson } from "../../../../server/src/db/model/lessonModel";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardTitle } from "../ui/card";

type Props = {
    onDeleteLesson?: (id: string) => Promise<void>;
    onStartMeet?: (id: string) => Promise<void>;
    
    lesson: ILesson;
    className?: string;
    owner: boolean;
}

export default function LessonCard({lesson, className, onDeleteLesson, onStartMeet, owner=false}: Props) {

  const navigate = useNavigate();

  const start = async () => {
    try {
      
      await onStartMeet!(lesson._id.toString());
      console.log('asdasd');
      navigate(`/meet/${lesson._id.toString()}`)
    } catch (e) {
      console.error((e as Error).message);
    }
  }
  
  
  return (
    <Card className={`w-full p-4 mb-4 gap-3 ${className}`} key={lesson._id.toString()}>
                        
        <CardTitle>{lesson.name}
            <CardDescription>{new Date(lesson.createdAt!).toLocaleDateString()}</CardDescription>
        </CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
        <CardAction className="flex gap-3">
            {lesson.isOpen &&
              <Button onClick={() => navigate(`/meet/${lesson._id.toString()}`)}>Join meet</Button>
            }     
            {owner && !lesson.isOpen &&
              <Button variant={'outline'} onClick={() => start()}>Start meeting</Button>
            }
            <Button variant={'outline'}>Notes</Button>
            {owner && onDeleteLesson &&
              <Button onClick={() => onDeleteLesson(lesson._id.toString())} variant={'destructive'}>Delete</Button>
            } 

        </CardAction>
    </Card>
  )
}
