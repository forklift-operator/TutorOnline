import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { socket } from '../../socket.js';
import { io } from "socket.io-client";
import Peer from 'peerjs'
import './Chat.css';
import Cookies from 'js-cookie'
const API_URL = import.meta.env.VITE_API_URL;

export default function Chat({ status }) {
    const user = { id: status.id, username: status.username };

    const { courseId, lessonId } = useParams();
    
    const [joined, setJoined] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [peer, setPeer] = useState(null);
    const [peers, setPeers] = useState(null);
    
    const [myVideo, setMyVideo] = useState(null);
    const [remoteVideos, setRemoteVideos] = useState([]);
    
    const myVideoRef = useRef(null);
    const remoteVideosRef = useRef({});

    function handleSubmitMessage(e) {
        e.preventDefault();
        
        if (message.trim() === '') return;

        socket.emit('send_message', { sender: user, content: message });
        
        setMessages((prevMsgs) => [...prevMsgs, { sender: user, content: message }]);
        setMessage('');
    }

    function CallUser(userId) {
        if (!peer || !myVideoRef) {
            console.error("Peer or local video stream is not ready.");
            console.log("PEER", peer.id);
            console.log("VID", myVideoRef);
            
            return;
        }
        
        if (userId === peer.id) return;
        console.log(userId);
        
        const call = peer.call(userId, myVideoRef.current.srcObject);

        call.on("stream", (video) => {
            if (!remoteVideosRef.current[userId]) {
                remoteVideosRef.current[userId] = video;
                
                setRemoteVideos((prevVideos) => [...prevVideos, video]);
            }
        })
        
        call.on("close", () => {
            console.log("Call closed with user:", userId);

            // Remove the stream from remoteVideosRef
            if (remoteVideosRef.current[userId]) {
                delete remoteVideosRef.current[userId];
                document.getElementById(userId).remove();
                setRemoteVideos((prevVideos) =>
                    prevVideos.filter((video) => video !== remoteVideosRef.current[userId])
                );
            }
        });
    
        call.on("error", (err) => {
            console.error("Call error with user:", userId, err);
        });
    }

    const handleLeaveMeet = () => {
        if (socket) {
            socket.disconnect();
        }

        if (peer) {
            peer.destroy();
        }

        setJoined(false);

        navigate(`/meet/${courseId}/${lessonId}`);

    }
    
    const handleCloseMeet = () => {
        if (socket) {
            socket.disconnect();
        }

        if (peer) {
            peer.destroy();
        }

        setJoined(false);

        fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "token": Cookies.get('token'), 
              "ngrok-skip-browser-warning": 1,
            },
            method: ["POST"],
            body: JSON.stringify({ setOpen: false })
        })
        .then(async res => {
            const data = await res.json();
            
            if (!res.ok) {
            throw new Error(data.error);
            }

            
        })
        .catch(e => console.error(e))

    } 

    function handleJoin() {
        setJoined(true);
        
        if (!peer) {
            console.error("Peer is not initialized yet.");
            return;
        }
        if (!myVideoRef) {
            console.error("Local video stream is not ready.");
            return;
        }

        socket.emit('join_room', {lessonId, peerId: peer.id, userId: status.id });

    }
    
    useEffect(() => {
        const newSocket = io(`${API_URL}`, {
            query: { "ngrok-skip-browser-warning": "1" },
            transports: ["websocket"]
        });
        setSocket(newSocket);
    
        const newPeer = new Peer();
        setPeer(newPeer);
        
        newPeer.on('open', (peerId) => {
            console.log({lessonId, peerId, status});
        })
        
        newSocket.on('user_left', ({ peerId }) => {
            console.log("User left:", peerId);

            console.log("vid", remoteVideosRef.current);
            delete remoteVideosRef.current[peerId];
            
            setRemoteVideos((prevVideos) =>
                prevVideos.filter((video) => video.id !== peerId)
            );
        })

        newSocket.on("chat_history", ({history}) => {
            setMessages(history);
        })

        newSocket.on("receive_message", (data) => {
            setMessages((prevMsgs) => [...prevMsgs, data]);
        });

        newSocket.on("error", ({message}) => {
            console.error(message);
        })

        return () => {
            newSocket.off("open"); 
            newSocket.off("chat_history"); 
            newSocket.off("receive_message"); 
            newSocket.off("error"); 
            newSocket.disconnect();
            newPeer.destroy();
            if (myVideoRef.current && myVideoRef.current.srcObject) {
                myVideoRef.current.srcObject.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, []); 

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }
                setMyVideo(stream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        getMediaStream();
    }, [])
   
    useEffect(() => {
        if (!peer || !myVideoRef || !socket) return;
    
        socket.on('new_user', (peerId) => {
            console.log("New peer:", peerId);
            CallUser(peerId);
        })
    
        socket.on("existing_users", ({users})=>{
            setPeers(users);
        })


        const handleCall = (call) => {
            console.log("Incoming call", call.peer);
    
            call.answer(myVideoRef.current.srcObject);
            
            call.on("stream", (video) => {
                console.log("answered");

                if (!remoteVideosRef.current[call.peer]) {
                    remoteVideosRef.current[call.peer] = video;

                    setRemoteVideos((prevVideos) => [...prevVideos, video]);
                }
            });
        };

        peer.on("call", handleCall);
    
        return () => {
            peer.off("call", handleCall);
            socket.disconnect();
            peer.destroy();
        };
    }, [peer, socket]);

    return (
        <div className='room'>
            <div className="video-container">
                <div className="media">

                    <div className="media-grid">
                        {myVideoRef && 

                            <video
                                className='my-video' 
                                autoPlay
                                muted
                                ref={myVideoRef} 
                                ></video>
                            }
                        {Object.values(remoteVideosRef.current).map((stream, i) => (
                            <video
                            className="other-videos"
                            key={stream.id}
                            autoPlay
                            ref={(el) => {
                                if (el) el.srcObject = stream;
                            }}
                            ></video>
                        ))}
                    </div>
                </div>
                <div className="controls">
                    {!joined ? 
                        <button onClick={() => handleJoin()}>Join</button>
                    :
                        <button onClick={() => handleCloseMeet()}>Close Meet</button>}
                </div>
            </div>

            {joined &&
                <div className="chat-container">
                <div className="message-container">
                    {messages.map((msg, i) => {
                        let msg_type = '';
                        switch (msg.sender.id) {
                            case 0:
                                msg_type = 'system';
                                break;

                            case status.id:
                                msg_type = 'sent';
                                break;

                            default:
                                msg_type = 'received';
                                break;
                        }
                        return (
                            <div key={i} className={`message ${msg_type}`}>
                                {msg_type !== 'system' && <p className="sender">{msg.sender.username}</p>}
                                <p className="content">{msg.content}</p>
                            </div>
                        );
                    })}
                </div>
                    <form className="message-input" onSubmit={handleSubmitMessage}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                        <button type="submit">Send</button>
                    </form>
            </div>
        }
        </div>
    );
}