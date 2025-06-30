import Cookies from "js-cookie";
import { useState, type FormEvent } from "react"
import type { IUser } from "../../../../server/src/db/model/userModel";
import type { Message } from "../../common/commonTypes";
import { Input } from "@/components/ui/input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";

type Props = {
    messages: Message[];
    onSendMessage: (message: Message) => void;
    className?: string;
}

export default function Chat({ onSendMessage, messages, className }: Props) {
    const [content, setContent] = useState('');
    const currUser = JSON.parse(Cookies.get('user') || '') as IUser;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSendMessage({sender: {id: currUser._id.toString(), username: currUser.username}, content, createdAt: new Date()});
        setContent('');
    }
    
  return (
<div className={`Chat flex flex-col ${className}`}>
  <div className="flex-1 overflow-y-auto">
    <ChatMessageList>
        {messages.map((message, idx) => {
            const sent = message.sender.id === currUser._id.toString();
            return (
            <ChatBubble className="flex flex-col gap-1" key={idx} variant={sent ? 'sent' : 'received'}>
                {message.sender.username}
                <ChatBubbleMessage className="px-2 py-1">{message.content}</ChatBubbleMessage>
            </ChatBubble>
            );
        })}
        </ChatMessageList>
    </div>

    <form onSubmit={handleSubmit} className="flex border-t p-2 gap-2">
        <Input
        type="text"
        className="flex-1"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type here..."
        />
    </form>
    </div>
  )
}

    