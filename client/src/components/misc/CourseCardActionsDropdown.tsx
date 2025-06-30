import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router"

type Props = {
    onDelete: (id: string) => Promise<void>,
    courseId: string,
    className?: string
}

export function CourseCardActionsDropdown({courseId, onDelete, className} :Props) {
    const navigate = useNavigate();
  return (
    <div className={`flex ${className}`}>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent p-0 min-w-0" align="start">
        <DropdownMenuGroup className="bg-transparent p-0 ">
          <DropdownMenuItem className="p-0 px-0 mb-1">
            <Button onClick={() => onDelete(courseId)} variant={'destructive'} className="w-full">Delete</Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 px-0">
            <Button onClick={() => navigate(`/courses/${courseId}/edit`)} className="w-full">Edit</Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
