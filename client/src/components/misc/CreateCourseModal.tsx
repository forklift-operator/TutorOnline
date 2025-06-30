import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import type { ICourse } from "../../../../server/src/db/model/courseModel";
import type { IUser } from "../../../../server/src/db/model/userModel";
import Cookies from "js-cookie";

type Props = {
  onCreateCourse: (course: Omit<ICourse,'_id'>) => Promise<void>
}

export function CreateCourseModal({ onCreateCourse }:Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const teacher = (JSON.parse(Cookies.get('user') || '') as IUser)._id;

  
    const handleSubmit = async () => {
        await onCreateCourse({ name, description, imgUrl, teacher });
        setOpen(false);
        setTimeout(() => {
        setName('');
        setDescription('');
        setImgUrl('')
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <form>
            <DialogTrigger asChild>
            <Button className="text-xl w-full" size={'lg'}>Create new course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create your new course</DialogTitle>
                <DialogDescription>
                Here you can create courses. Set a name, description, image url and then click create when you're done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input 
                        id="name-1" 
                        name="name" 
                        onChange={e => setName(e.target.value)} 
                        value={name} 
                        placeholder="Math 101" 
                        required/>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="description-1">Description</Label>
                    <textarea
                        required
                        onChange={e => setDescription(e.target.value)}
                        className="text-wrap border rounded px-3 py-2 focus:outline-none focus:ring w-full min-h-[80px] resize-y"
                        id="description-1"
                        value={description}
                        name="description"
                        placeholder="Math for begginers that want to excel in shcool..."
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="imgUrl-1">Image URL</Label>
                    <Input 
                        id="imgUrl-1" 
                        name="imgUrl" 
                        onChange={e => setImgUrl(e.target.value)} 
                        value={imgUrl} 
                        placeholder="The cover image of your course" required/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSubmit} type="submit">Create</Button>
            </DialogFooter>
            </DialogContent>
        </form>
        </Dialog>
    )
}
