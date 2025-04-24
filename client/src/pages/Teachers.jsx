import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import UserCard from '../components/UserCard';
const API_URL = import.meta.env.VITE_API_URL;

export default function Teachers({ myId }) {
    const [teachers, setTeachers] = useState([]);
    
    useEffect(() => {
        fetch(`${API_URL}/api/teachers`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'), 
                "ngrok-skip-browser-warning": 1,
            },
            method: ["GET"],
        })
        .then(async (res) => {
            if(!res.ok){
                const response = await res.json();
                throw new Error(response.message);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            
            setTeachers(data);
        })
        .catch((e) => {console.error(e)})
    }, [])


  return (
    <div className="teachers">

        <h2>Teachers</h2>
        <div className="user-cards">
            {teachers.map((teacher) => {
                return (
                    <UserCard
                    key={teacher._id} 
                    myId={myId} 
                    user={teacher}
                    you={myId === teacher._id}
                    />
                )
            })}
        </div>
    
    </div>
  )
}
