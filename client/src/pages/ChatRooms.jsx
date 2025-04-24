import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Cookies from "js-cookie"
const API_URL = import.meta.env.VITE_API_URL;

export default function ChatRooms({  }) {

    const [rooms, setRooms] = useState([])
    
    useEffect(() => {
        fetch(`${API_URL}/api/rooms`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'), 
                "ngrok-skip-browser-warning": 1,
            },
            method: "GET",
        })
        .then(async (res) => {
            if(!res.ok){
                const text = await res.json();
                throw new Error(text.error);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setRooms(data);
        })
        .catch((e) => console.error(e))
    }, [])
    
  return (
    <>
        <div>ChatRooms</div>
        {rooms.map((room, i) => {
            return(
                <div key={i} className="room-card">
                    <Link to={`/chat/${room._id}`}>{room.name || `Room ${i+1}`}</Link>
                </div>
            )
        })}
    </>
  )
}
