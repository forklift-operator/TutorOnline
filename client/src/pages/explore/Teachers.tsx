import { useEffect, useState } from 'react'
import UserCard from '../../components/cards/UserCard.js';
import Cookies from 'js-cookie';
import type { IUser } from '../../../../server/src/db/model/userModel.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';


type Props = {
    fetchTeachers: (entityType: string, filter?: Record<string, any>) => Promise<IUser[]>,
}

export default function Teachers({ fetchTeachers }: Props) {
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true)
    const myId = (JSON.parse(Cookies.get('user') || '') as IUser)._id;
    
    const fetch = async (filter?: Record<string, any>) => {
        try {
            const teachers = await fetchTeachers('teacher', filter);
            setLoading(false);
            setTeachers(teachers);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    useEffect(() => {
        fetch();
    },[])

    useEffect(() => {
        console.log("Teachers:", teachers);
    }, [teachers]);

    
  return (
      <div className="Teachers">
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
            {teachers.map((user: IUser) => {
                return (
                    <UserCard 
                    key={user._id.toString()}
                    user={user}
                    myId={myId.toString()}
                    // handleEdit={handleEdit}
                    />
                );
            })}
        </div>
    </div>
  )
}
