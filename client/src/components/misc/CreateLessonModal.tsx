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
import type { ILesson } from "../../../../server/src/db/model/lessonModel";
import type { Types } from "mongoose";

type Props = {
  onCreateLesson: (lesson: Omit<ILesson,'_id'>) => Promise<void>,
  className?: string,
  teacherId: Types.ObjectId,
  courseId: Types.ObjectId,
}

export function CreateLessonModal({ onCreateLesson, className, courseId, teacherId}:Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    await onCreateLesson({ name, description, courseId, teacherId });
    setOpen(false);
    setTimeout(() => {
      setName('');
      setDescription('');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="text-xl w-full" size={'lg'}>Create new lesson</Button>
        </DialogTrigger>
        <DialogContent className={`sm:max-w-[425px] ${className}`} >
          <DialogHeader>
            <DialogTitle>Create your new lesson</DialogTitle>
            <DialogDescription>
              Here you can create lessons for your course. Set a name and a description then click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" onChange={e => setName(e.target.value)} value={name} placeholder="Introduction to ..." required/>
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
                placeholder="Purpose of this lesson is to ..."
              />
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
