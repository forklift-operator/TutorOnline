import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


export default function Login({ setStatus }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("")
    const navigate = useNavigate();
    
    function handleSubmit(event){
        event.preventDefault();
        fetch(`${API_URL}/api/login`,
            {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  "ngrok-skip-browser-warning": 1,

                },
                method: "POST",
                body: JSON.stringify({username, password})
        })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.json();
                throw new Error(text.error);
            }
            return res.json();
        })
        .then((data) => {
            Cookies.set('token', data.token, {expires: 7, sameSite: 'Lax'});
            setStatus({ logged: true, id: data.id, role: data.role })
            navigate('/')
        })
        .catch((error) => { 
            setError(error);
            console.error('Error:', error)
        }); 
    }
    
  return (
    <div>
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <label>Enter your username:
                <input
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </label>

            <label>Password:
                <input
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            
            <button type='submit'>Sign In</button>
        </form>
    </div>
  )
}
