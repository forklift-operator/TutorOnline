import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

export default function BrowseCourses() {

    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
    fetch(`${API_URL}/api/courses`,{
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "token": Cookies.get('token'), 
            "ngrok-skip-browser-warning": 1,
        }
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        setCourses(data);
    })
    }, [])
    
  return (
    <div>BrowseCourses</div>
  )
}
