import { useEffect, useState } from 'react'
import UserCard from '../../components/cards/UserCard';
import Cookies from 'js-cookie';
import type { IUser } from '../../../../server/src/db/model/userModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


type Props = {
    fetchUsers: (entityType: string, filter?: Record<string, any>) => Promise<IUser[]>,
    onDelete: (entityType: string ,userId: string) => Promise<IUser>,
    onEditUser?: (entityType: string, updated: IUser) => Promise<IUser>,
}

export default function Users({ fetchUsers, onDelete, onEditUser }: Props) {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true)
    const myId = (JSON.parse(Cookies.get('user') || '') as IUser)._id;
    
    const fetch = async (filter?: Record<string, any>) => {
        try {
            const users = await fetchUsers('user', filter);
            setLoading(false);
            setUsers(users);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const deleteUser = async (userId: string): Promise<void> => {
        try {
            await onDelete('user' ,userId);
            setUsers(users.filter(user => user._id.toString() !== userId));
        } catch (e) {
            console.error((e as Error).message);
        }
    }
    
    const updateUser = async (updatedUser: IUser) => {
        
        try {
            if (!onEditUser) return;
            console.log('asd');
            const updated = await onEditUser('user', updatedUser);
            console.log(updated);
            
            setUsers(users.map(user => user._id === updatedUser._id ? { ...user, ...updatedUser } : user));
        } catch (e) {
            console.error((e as Error).message);
        }
    }
    
    useEffect(() => {
        fetch();
    },[])

    useEffect(() => {
        console.log("Users:", users);
    }, [users]);

    
  return (
      <div className="Users">
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
            {users.map((user: IUser) => {
                return (
                    <UserCard
                        key={user._id.toString()}
                        user={user}
                        myId={myId.toString()}
                        adminView={true}
                        onDelete={deleteUser}
                        onEditUser={updateUser}
                    />
                );
            })}
        </div>
    </div>
  )
}
