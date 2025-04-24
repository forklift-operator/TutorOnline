import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;

export default function UserDetails({  }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        fetch(`${API_URL}/api/users/${id}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'), 
                "ngrok-skip-browser-warning": 1,
            },
            method: "GET",
        }).then(async (res) => {
            if (!res.ok) {
                const text = await res.json(); 
                throw new Error(`Error getting user: ${text.message}`);
            }
            return res.json();
        }).then((data) => {
            setUser(data);
            setLoading(false);
            console.log(data);
        }).catch((e) => { 
            setLoading(false)
            console.log(e);
        })
        
    }, [])
    
    if (loading) {
        return <h2>Loading...</h2>
    }
    
    if(!user) {
        return <h1>Couldn't find user</h1> 
    }

    return (
        <div className='user-details'>
            <h2>User Details</h2>
            <p>ID: {user._id}</p>
            <p>Name: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
}
