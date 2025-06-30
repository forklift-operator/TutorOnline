import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import Chat from './Chat';
import { defaultUserImg, type Message } from '../../common/commonTypes';
import SocketService from '../../services/socketService';
import PeerService from '../../services/peerService';
import type { IUser } from '../../../../server/src/db/model/userModel';
import Cookies from 'js-cookie';
import { createImageVideoStream } from '../../services/ImageToStream';
import Streams from './Streams';
import { Button } from '@/components/ui/button';

type Props = {
    socketService: SocketService;
    peerService: PeerService;
    valid?: boolean;
    error?: string;
}

export default function Meet({ socketService, peerService, valid=false, error }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const { lessonId } = useParams();

    const currUser = JSON.parse(Cookies.get('user') || '') as IUser;

    const [joined, setJoined] = useState(false);

    const remoteStreamsRef = useRef<{ [peerId: string]: MediaStream }>({});
    const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
    const updateRemoteStreams = () => {
        setRemoteStreams(Object.values(remoteStreamsRef.current));
    };    

    const myStreamRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream>(new MediaStream);

    const [chat, setChat] = useState(false);
 
   
    useEffect(() => {
        const getMediaStream = async () => {
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch (error) {
                stream = await createImageVideoStream(currUser.imageURL || defaultUserImg);
                console.error("Error accessing media devices:", error);
            }
            if (myStreamRef.current) {
                myStreamRef.current.srcObject = stream;
            }
            setStream(stream);
        };

        getMediaStream();

        return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
    }, [])

   
    useEffect(() => {
        // init for socket
        socketService.connect('http://localhost:8080');
        socketService.on('connect', () => console.log('Connected to socket server'));
        
        // init for peer
        peerService.initPeer(currUser._id.toString());
        peerService.onOpen((id) => {
            socketService.emit('user_ready', { peerId: id, lessonId });
        });
        
        // disconnecting the socket and peer
        const emitLeave = () => {
            socketService.emit('leave', { peerId: currUser._id.toString() });    
        }
        window.addEventListener('beforeunload', emitLeave);
        socketService.on('disconnect', emitLeave)

        return () => {
            socketService.emit('leave');
            window.removeEventListener('beforeunload', emitLeave);
            socketService.disconnect();
            peerService.destroy();
        };
    }, []);

    useEffect(() => {
        if (!stream.active) {
            return;
        }
        
        // call from the new user
        const callPeer = (peerId: string) => {
            console.log('new user calling:', peerId );
            const call = peerService.call(peerId, stream);
            console.log(call);
            
            call?.on('stream', (remoteStream) => {
                console.log(remoteStream);
                remoteStreamsRef.current[call.peer] = remoteStream;
                updateRemoteStreams();
            })
        }

        // call from the old user
        peerService.onCall(call => {
            console.log('old user calling:', call.peer);
            console.log(call);
            call.answer(stream);
            
            call.on('stream', (remoteStream) => {
                remoteStreamsRef.current[call.peer] = remoteStream;
                updateRemoteStreams();
            });
        })

        // delete the left user stream
        const onUserLeft = (peerId: string) => {
            console.log(peerId);
            
            delete remoteStreamsRef.current[peerId];
            updateRemoteStreams();
        }

        const onMessageHistory = (messages: Message[]) => {
            console.log(messages);
            
            setMessages(messages);
        }

        const onNewMessage = (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        }
        
        socketService.on('new_user', callPeer);
        socketService.on('user_left', onUserLeft);
        socketService.on('chat_history', onMessageHistory);
        socketService.on('new_message', onNewMessage);
        
        return () => {
            socketService.off('new_user', callPeer);
            socketService.off('user_left', onUserLeft);
        }

    }, [stream])

    const handleJoin = () => {
        socketService.emit('join');
        setJoined(true);
    };
    
    const handleLeave = (close = false) => {
        if (close) socketService.emit('close');
        socketService.emit('leave');
        remoteStreamsRef.current = {};
        setMessages([]);
        updateRemoteStreams();
        setJoined(false);
        setChat(false);
        window.location.href = '/courses/my';
    }
    
    const handleSendMessage = (message: Message) => {
        if (!joined) return;
        message.createdAt = new Date();
        socketService.emit('sent_message', message);
        setMessages(prevMessages => [...prevMessages, message]);
    }

    
    return (
        <div className='Meet flex flex-row p-10 h-full w-full justify-center box-border'>

            <Streams myStream={stream} remoteStreams={remoteStreams}>
            <div className="actions w-full flex flex-row gap-5 justify-center items-center absolute bottom-5 box-border">
                {stream?.active ? (
                    error ? (
                    <Button disabled variant="destructive">{error}</Button>
                    ) : valid ? (
                    !joined ? (
                        <Button onClick={handleJoin} className="text-xl">
                        Join
                        </Button>
                    ) : (
                        <div className="flex gap-4">
                        <Button onClick={() => setChat(!chat)} className="text-xl">
                            Chat
                        </Button>
                        <Button onClick={() => handleLeave()} className="text-xl" variant="destructive">
                            Leave
                        </Button>
                        <Button onClick={() => handleLeave(true)} className="text-xl" variant="destructive">
                            Close meet
                        </Button>
                        </div>
                    )
                    ) : (
                    <Button disabled className="text-xl" variant="ghost">
                        Wait
                    </Button>
                    )
                    ) : (
                        <Button disabled className="text-xl" variant="ghost">
                        Initializing...
                        </Button>
                    )}
                </div>
                {chat &&
                    <Chat  
                        messages={messages} 
                        onSendMessage={handleSendMessage}
                        className='absolute w-30% h-full right-0'
                    />
                }
            </Streams>

        </div>
    );
}