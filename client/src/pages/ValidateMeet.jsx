import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie"
import Chat from './Chat';

const API_URL = import.meta.env.VITE_API_URL;

export default function ValidateMeet({ status }) {

    const [loading, setLoading] = useState(true);
    const [validLesson, setValidLesson] = useState(null);
    const { courseId, lessonId } = useParams();

    // check for the valid id
    useEffect(() => {
        fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'), 
                "ngrok-skip-browser-warning": 1,
            },
            method: ["GET"],
        })
        .then(async res => {
            const data = await res.json();
            
            if(!res.ok) {
                setLoading(false);
                setValidLesson(false);
                throw new Error(data.error);
            }

            setLoading(false);
            setValidLesson(true);
        })
        .catch(e => console.error(e));
    }, [])

    if (loading) {
        return (
            <h2>Loading</h2>
        )
    }

    if (!validLesson) {
        return (
            <h2>Not a valid course or lesson ID</h2>
        )
    }

    
    return (
        <Chat status={status}/>
    )
}
