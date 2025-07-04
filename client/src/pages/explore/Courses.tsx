import { useEffect, useState } from 'react'
import type { ICourse } from '../../../../server/src/db/model/courseModel';
import CourseCard from '@/components/cards/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { IUser } from '../../../../server/src/db/model/userModel';
import Cookies from 'js-cookie';

type Props = {
    fetchCourses: (entityType: string, filter?: Record<string, any>) => Promise<ICourse[]>;
    onDelete: (entityType: string, id: string) => Promise<ICourse>,
}

export default function Courses({ fetchCourses, onDelete }: Props) {

    const [courses, setCourses] = useState<ICourse[]>([])
    const adminView = (JSON.parse(Cookies.get('user') || '') as IUser).roles.includes('admin');
    
    const fetch = async (filter?: Record<string, any>) => {
        try {
            const courses = await fetchCourses('course', filter);
            setCourses(courses);
        } catch (e) {
            console.error(e);
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
    <div>
        <div className="flex flex-row gap-4">
            <Input
                onChange={e => {
                    const value = e.target.value;
                    if (value.trim() === "") {
                        fetch();
                    } else {
                        fetch({ name: value });
                    }
                }}
                placeholder='Search by name...'
            />
            <Button className='mb-5' onClick={() => fetch()}>Refresh</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
                <CourseCard key={course._id.toString()} course={course} view={adminView ? 'TEACHER' : 'STUDENT'} onDelete={handleDeleteCourse}/>
            ))}
        </div>
    </div>
  )
}
