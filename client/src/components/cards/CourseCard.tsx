import { Link } from 'react-router'
import type { ICourse } from '../../../../server/src/db/model/courseModel';
import { Rating, RatingButton } from '../../components/ui/shadcn-io/rating';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { defaultCourseImg } from '@/common/commonTypes';
import { CourseCardActionsDropdown } from '../misc/CourseCardActionsDropdown';
import { Label } from '@radix-ui/react-label';

type Props = {
    course: ICourse, 
    onDelete?: (courseId: string) => Promise<void>, 
    view?: 'STUDENT' | 'TEACHER';
}

export default function CourseCard({course, onDelete, view='STUDENT' }: Props) {
  return (
    
        <Card className='bg-background text-foreground pt-0 overflow-hidden'>
            <div className="relative w-full">

                <img 
                    src={course.imgUrl ? course.imgUrl : defaultCourseImg} 
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = defaultCourseImg;
                    }}
                    alt="course image" 
                    className="w-full h-20 object-cover brightness-30 relative"
                    />
                <CardTitle className='absolute bottom-0 left-0 pb-2 px-5 w-full text-4xl font-bold leading-none capitalize '>{course.name}</CardTitle> 
                {view === "TEACHER" && onDelete &&
                    <CourseCardActionsDropdown className='absolute top-3 right-3' courseId={course._id.toString()} onDelete={onDelete}/>
                }
            </div>  

            <Label className='px-5'>Description:
                <CardDescription>{course.description}</CardDescription>
            </Label>

            <div className='px-5 flex items-center gap-2'>
                <Label>Rating:</Label>
                <Rating readOnly defaultValue={course.rating}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <RatingButton key={index} />
                    ))}
                </Rating>
            </div>

            <Label className='px-5'>Students enrolled: {course.students?.length}</Label>

            <Link className='px-5' to={`/courses/${course._id.toString()}`}>More...</Link>
            {course.currentLessonId && 
                <Link className={'join'} to={`/meet/${course.currentLessonId.toString()}`}>Join latest lesson</Link>
            }
        </Card>
        
  )
}
