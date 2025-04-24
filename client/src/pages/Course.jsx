import { useParams } from "react-router-dom"
const API_URL = import.meta.env.VITE_API_URL;

export default function Course({ status }) {
    const params = useParams();

    const handleGetCourse = () => {
        fetch(`${API_URL}/api/courses/${params.courseId}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: ["GET"],
        })
        .then(async res => {
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error);
            }
            
            console.log(data);
            
        })
    }
    
  return (
   <div>Course</div>
  )
}