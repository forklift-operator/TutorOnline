import { useEffect, useState } from 'react'
import type { ICourse } from '../../../../server/src/db/model/courseModel';
import CourseCard from '@/components/cards/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
    fetchCourses: (entityType: string, filter?: Record<string, any>) => Promise<ICourse[]>;
}

export default function Courses({ fetchCourses }: Props) {

    const [courses, setCourses] = useState<ICourse[]>([])
    
    const fetch = async (filter?: Record<string, any>) => {
        try {
            const courses = await fetchCourses('course', filter);
            setCourses(courses);
        } catch (e) {
            console.error(e);
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
                <CourseCard key={course._id.toString()} course={course} />
            ))}
        </div>
    </div>
  )
}
