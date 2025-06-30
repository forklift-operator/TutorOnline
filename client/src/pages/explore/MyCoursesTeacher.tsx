import { useEffect, useState } from 'react'
import CourseCard from '../../components/cards/CourseCard'
import type { ICourse } from '../../../../server/src/db/model/courseModel';
import { CreateCourseModal } from '../../components/misc/CreateCourseModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { IUser } from '../../../../server/src/db/model/userModel';
import Cookies from 'js-cookie';

type Props = {
  onFetchCourses: (entityType: string, filter?: Record<string, any>) => Promise<ICourse[]>,
  onDelete: (entityType: string, id: string) => Promise<ICourse>,
  onCreate: (entityType: string, entity: Omit<ICourse, '_id'>) => Promise<ICourse>,
}

export default function MyCoursesTeacher({ onFetchCourses, onDelete, onCreate }: Props) {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const myId = (JSON.parse(Cookies.get('user') || '') as IUser)._id;

  const fetch = async () => {
    try {
      const courses = await onFetchCourses('course', { teacher:  myId.toString()});
      setCourses(courses);
    } catch (e) {
      console.error((e as Error).message);
    }
  }

  const handleNewCourse = async (newCourse: Omit<ICourse, '_id'>) => {
    try {
      const course = await onCreate('course', newCourse);
      setCourses([...courses, course]);
    } catch (e) {
      console.error((e as Error).message);
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await onDelete('course', courseId);
      setCourses(courses.filter(course => course._id.toString() !== courseId));
    } catch (e) {
      console.error((e as Error).message);
    }
  }

  useEffect(() => {
    fetch();
  }, [])

  return (
    <div className="MyCourses flex flex-col justify-center items-center">
      
      <CreateCourseModal onCreateCourse={handleNewCourse}></CreateCourseModal>

      <Carousel className="mt-15 w-full lg:max-w-4xl md:w-50% sm:max-w-xl overflow-x-hidden md:overflow-visible lg:overflow-visible">
      <CarouselContent>
        {courses.map((course, index) => (
          <CarouselItem key={index} className="lg:basis-1/3 md:basis-1/2 sm:basis">
            <CourseCard course={course} view='TEACHER' onDelete={handleDeleteCourse}></CourseCard>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </div>
  )
}
