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
import { defaultCourseImg } from "@/common/commonTypes";
import type { IUser } from "../../../../server/src/db/model/userModel";

type Props = {
    user: IUser;
    onEditUser: (newUser: IUser) => Promise<void>;
    className?: string;
}

export function UpdateUserModal({ user, onEditUser, className }:Props) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [imageUrl, setImgUrl] = useState('')
  
    useEffect(() => {
        if (open) {
            setName(user.name)
            setUsername(user.username)
            setBio(user.bio || '')
            setImgUrl(user.imageUrl || defaultCourseImg)
        }
    }, [open])
    
    const handleSubmit = async () => {
        await onEditUser({ ...user, name, imageUrl });
        setOpen(false);
        setName('');
        setUsername('');
        setBio('');
        setImgUrl('')
    };

    const handleCancel = () => {
        setName('');
        setUsername('');
        setBio('');
        setImgUrl('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <form>
            <DialogTrigger asChild className={className}>
            <Button size={'lg'}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit user</DialogTitle>
                <DialogDescription>
                    Here you can edit users. Set new name, bio, image url and then click edit when you're done.
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
                        placeholder="John Doe"
                        required
                        />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username-1">Username</Label>
                    <Input
                    id="username-1"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="johndoe123"
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="bio-1">Bio</Label>
                    <textarea
                        id="bio-1"
                        name="bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="text-wrap border rounded px-3 py-2 focus:outline-none focus:ring w-full min-h-[80px] resize-y"
                        placeholder="Short description of the user"
                        />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="imageUrl-1">Image URL</Label>
                     <Input
                        id="imageUrl-1"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={e => setImgUrl(e.target.value)}
                        placeholder="Profile pic of the user"
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
