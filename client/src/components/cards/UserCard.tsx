import type { IUser } from '../../../../server/src/db/model/userModel'
import { Card, CardDescription, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { defaultUserImg } from '@/common/commonTypes';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { UserCardActionsDropdown } from '../misc/UserCardActionsDropdown';

type Props = {
  user: IUser,
  myId: string,
  onDelete?: (userId: string) => Promise<void>,
  onEditUser?: (newUser: IUser) => Promise<void>;
  adminView?: boolean,
}

export default function UserCard({ user, myId, onDelete, onEditUser, adminView=false }: Props) {

  return (
        <Card className='bg-background gap-5 text-foreground pt-0 overflow-hidden py-5 px-5'>
            {adminView ?
              <div className="flex flex-row gap-2">
                {myId === user._id.toString() && 
                  <Badge variant={'outline'}>YOU</Badge>
                }
                {user.roles.includes('admin') && 
                  <Badge variant={'destructive'}>admin</Badge>
                }
                {user.roles.includes('teacher') && 
                  <Badge variant={'default'}>teacher</Badge>
                }
                {user.roles.includes('student') && 
                  <Badge variant={'secondary'}>student</Badge>
                }
              </div>
            :
              <Badge variant={'default'}>teacher</Badge>
            }

            <div className="w-full flex flex-row gap-3">
              <Avatar className='w-15 h-15'>
                  <AvatarImage 
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = defaultUserImg;
                    }}
                    src={user.imageUrl || defaultUserImg}
                    alt='img'
                    />
                    <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <CardDescription className='text-xs'>{user.username}</CardDescription>
                <CardTitle className='text-xl'>{user.name}</CardTitle>
                <CardDescription className='text-xs underline'>{user.email}</CardDescription>
              </div>
            </div>

            <Label className='flex flex-col items-start'>Bio:
              <CardDescription className='text-xs'>{user.bio || 'No bio provided'}</CardDescription>
            </Label>

            {onDelete && myId !== user._id.toString() && onEditUser &&
              <UserCardActionsDropdown  onDelete={onDelete} onEditUser={onEditUser} user={user}/>
            }
        </Card>
  )
}
