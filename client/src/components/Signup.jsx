import React from 'react'
import { useState } from 'react'
import "./Signup.css"
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


export default function Singup({ setStatus }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student");
    const navigate = useNavigate();
    

    function handleSubmit(event){
        event.preventDefault();
        fetch(`${API_URL}/api/register`,
            {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  "ngrok-skip-browser-warning": 1,

                },
                method: "POST",
                body: JSON.stringify({username, email, password, role})
            })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.json();
                    throw new Error(text.error);
                }
                return res.json();
            })
            .then((data) => { 
                Cookies.set("token", data.token, {expires: 7, secure: true, sameSite: 'strict'})
                setStatus({ logged: true, id: data.id, role: data.role });
                navigate("/");
             })
            .catch((error) => { console.error('Error:', error) });
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

            <label>Email:
                <input
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            <label>Password:
                <input
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <label>Role:
                {/* <input
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                /> */}
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                </select>
            </label>


            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}
