import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateUserModal } from "./UpdateUserModal"
import type { IUser } from "../../../../server/src/db/model/userModel";
import type { MouseEvent } from "react" 

type Props = {
    onDelete: (id: string) => Promise<void>;
    onEditUser: (newUser: IUser) => Promise<void>;
    user: IUser;
    className?: string;
}

export function UserCardActionsDropdown({user, onDelete, className, onEditUser} :Props) {

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await onDelete(user._id.toString());
    } catch (e) {
      console.error((e as Error).message);
    }
  }
  
  return (
    <div className={`flex ${className}`}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button onClick={e => e.stopPropagation()} variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={e => e.stopPropagation()} className="bg-transparent p-0 min-w-0 border-none w-full" align="center">
        <DropdownMenuGroup className="bg-transparent p-0 ">
          <DropdownMenuItem className="p-0 px-0 mb-1" onSelect={e => e.preventDefault()}>
            <Button onClick={handleDelete} variant={'destructive'} className="w-full">Delete</Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 px-0" onSelect={e => e.preventDefault()}>
            <UpdateUserModal onEditUser={onEditUser} user={user}/>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
