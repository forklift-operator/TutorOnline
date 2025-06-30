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

type Props = {
    onDelete: (id: string) => Promise<void>;
    onEditUser: (newUser: IUser) => Promise<void>;
    user: IUser;
    className?: string;
}

export function UserCardActionsDropdown({user, onDelete, className, onEditUser} :Props) {
  return (
    <div className={`flex ${className}`}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent p-0 min-w-0" align="start">
        <DropdownMenuGroup className="bg-transparent p-0 ">
          <DropdownMenuItem className="p-0 px-0 mb-1" onSelect={e => e.preventDefault()}>
            <Button onClick={() => onDelete(user._id.toString())} variant={'destructive'} className="w-full">Delete</Button>
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
