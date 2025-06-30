import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import type { IUser } from '../../../../server/src/db/model/userModel'

type Props = {
    onFetch: (entityType: string, id: string) => Promise<IUser>,
    onUpdate: (entityType: string, entity: IUser) => Promise<IUser>,
    view: 'USER' | 'ADMIN',
}

export default function UserDetails({ onFetch, onUpdate, view }: Props) {
    const { id } = useParams<string>();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const entityType = view === "ADMIN" ? 'user' : 'teacher';
    
    const refresh = async () => {
        try {
            const user = await onFetch(entityType, id!);
            if (user) {
                setUser(user);
            }
        } catch (e) {
            console.error((e as Error).message);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        refresh();        
    }, [])
    
    if (loading) {
        return <h2>Loading...</h2>
    }
    
    if(!user) {
        return <h1>Couldn't find user</h1> 
    }

    return (
        <div className='UserDetails'>
            <h2>{view==='ADMIN' ? 'User' : 'Teacher'} Details</h2>
            <p>ID: {user._id.toString()}</p>
            <p>Name: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.roles.toString()}</p>
            <p>Created At: {new Date(user.createdAt!).toLocaleDateString()}</p>
        </div>
    );
}
