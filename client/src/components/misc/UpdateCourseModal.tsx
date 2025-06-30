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
import { useEffect, useState } from "react";
import type { ICourse } from "../../../../server/src/db/model/courseModel";
import { defaultCourseImg } from "@/common/commonTypes";

type Props = {
    course: ICourse;
    onUpdateCourse: (newCourse: ICourse) => Promise<void>;
    className?: string;
}

export function UpdateCourseModal({ course, onUpdateCourse, className }:Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imgUrl, setImgUrl] = useState('')
  
    useEffect(() => {
        if (open) {
        setName(course.name)
        setDescription(course.description)
        setImgUrl(course.imgUrl || defaultCourseImg)
    }
    }, [open, course])
    
    const handleSubmit = async () => {
        await onUpdateCourse({ ...course, name, description, imgUrl });
        setOpen(false);
        setTimeout(() => {
        setName('');
        setDescription('');
        setImgUrl('')
        }, 1000);
    };

    const handleCancel = () => {
        setTimeout(() => {
        setName('');
        setDescription('');
        setImgUrl('')
        }, 1000);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <form>
            <DialogTrigger asChild className={className}>
            <Button className="text-xl" size={'lg'}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit your course</DialogTitle>
                <DialogDescription>
                Here you can edit courses. Set new name, description, image url and then click edit when you're done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                        id="name-1"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Math 101"
                        required
                        />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="description-1">Description</Label>
                    <textarea
                        id="description-1"
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="text-wrap border rounded px-3 py-2 focus:outline-none focus:ring w-full min-h-[80px] resize-y"
                        placeholder="Math for beginners that want to excel in school..."
                        required
                        />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="imgUrl-1">Image URL</Label>
                     <Input
                        id="imgUrl-1"
                        name="imgUrl"
                        value={imgUrl}
                        onChange={e => setImgUrl(e.target.value)}
                        placeholder="The cover image of your course"
                        required
                        />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSubmit} type="submit">Save</Button>
            </DialogFooter>
            </DialogContent>
        </form>
        </Dialog>
    )
}
