import React, { useEffect, useRef, useState } from 'react'
import CourseCard from '../components/CourseCard'
import "./MyCourses.css"
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function MyCoursesTeacher({ status }) {
  const coursesDivRef = useRef(null);
  const newCourseBtnRef = useRef(null);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseIndex, setCourseIndex] = useState(0);
  
  const [addingCourseModal, setAddingCourseModal] = useState(false)
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("")
  
  const handleOpenAddCourseModal= () => {
    setAddingCourseModal(true);
  
  } 

  const handleCloseAddCourseModal= () => {
    setAddingCourseModal(false);
  } 
  
  const handleNewCourse = (e) => {
    e.preventDefault();
    

    if (newCourseBtnRef && newCourseBtnRef.current) {
      newCourseBtnRef.current.setAttribute("disabled", "true");
    }

    
    fetch(`${API_URL}/api/courses`,{
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": Cookies.get('token'), 
        "ngrok-skip-browser-warning": 1,
      },
      method: ["POST"],
      body: JSON.stringify({name: courseName, description: courseDescription, teacher: status.id}),
    })
    .then(async res => {
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error);
      } 
      
      setAddingCourseModal(false);
      setCourseName("");
      setCourseDescription("");

      const newCourses = [...courses, data]
      setCourses(newCourses);
      
      setCourseIndex(newCourses.length-1);
      newCourseBtnRef.current.removeAttribute("disabled");

      // handleScroll(newCourses.length - courseIndex - 1);
      handleScroll(1);

      console.log(data);
      
    })
    .catch(e => console.error(e))

  }
  
  const handleGetCourses = () => {
    fetch(`${API_URL}/api/teachers/${status.id}/courses`, {
      headers:{
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
        throw new Error( data.error );
      }
      console.log(data);
      
      setCourses(data);
    })
    .catch(e => console.error(e))
  }

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course._id != courseId))
    setCourseIndex(0);
    if (newCourseBtnRef.current.disabled) newCourseBtnRef.current.removeAttribute("disabled"); 
    
    fetch(`${API_URL}/api/courses/${courseId}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": Cookies.get('token'), 
        "ngrok-skip-browser-warning": 1,
      },
      method: ["DELETE"],
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log(data);
    })
    .catch(e => console.error(e))
  }

  const handleCreateLesson = (courseId, lessonInfo) => {
    fetch(`${API_URL}/api/courses/${courseId}/lessons`,{
      headers:{
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": Cookies.get('token'),
        "ngrok-skip-browser-warning": 1,
      },
      method: ["POST"],
      body: JSON.stringify({ name: lessonInfo.name, description: lessonInfo.description}),
    })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      handleGetCourses();
      console.log(data);
    })  
    .catch(e => console.error(e));
  } 

  const handleJoinLesson = (courseId, lessonId, isOpen) => {
    if (isOpen) {
      navigate(`/meet/${courseId}/${lessonId}`);
    }else{
      fetch(`${API_URL}/api/courses/${courseId}/lessons/${lessonId}/open`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "token": Cookies.get('token'), 
          "ngrok-skip-browser-warning": 1,
        },
        method: ["POST"]
      })
      .then(async res => {
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error);
        }
        
        navigate(`/meet/${courseId}/${lessonId}`);
      })

    }
  }

  const handleScroll = (dir) => {
    if (coursesDivRef.current) {
      const width = coursesDivRef.current.offsetWidth + 10;
      const childrenCount = courses.length;
  
      const newIndex = (courseIndex + dir + childrenCount) % childrenCount;
  
      const newScrollAmount = newIndex * width;
  
      coursesDivRef.current.scrollTo({
        left: newScrollAmount,
      });

      setCourseIndex(newIndex);
    }
  }

  useEffect(() => {
    handleGetCourses();
  }, [])

  return (
    <div className="my-courses">
      <h2>MyCourses</h2>
      <button ref={newCourseBtnRef} className="add-course" onClick={() => handleOpenAddCourseModal()} disabled={courses.length >= 10}>Add Course</button>
      {addingCourseModal && 
      <div className="modal-overlay">
        <div className="add-course modal">
          <button className="close-button" onClick={() => handleCloseAddCourseModal()}>✖</button>

          <div className="new-course">
            <form onSubmit={(e) => handleNewCourse(e)}>
              <h2>Add new course</h2>
              <input className="course-name" type="text" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
              <input className="course-description" type="text" onChange={(e) => setCourseDescription(e.target.value)} placeholder="Description" value={courseDescription} />
              <button className="submit-new-course" type="submit">Add</button>
            </form>
          </div>
        </div>

      </div>
      }
      <div className="courses">
        <button onClick={() => handleScroll(-1)}><i className='fa fa-arrow-left'></i></button>
          <div className="courses-container">
            <div ref={coursesDivRef} className="courses-cards">
              {courses && courses.map((course) => {
                return <CourseCard 
                        key={course._id} 
                        status={status}
                        course={course}
                        onDelete={handleDeleteCourse}
                        onCreateLesson={handleCreateLesson}
                        onJoin={handleJoinLesson}/> 
              })}
            </div>
            <div className="dots">
              {courses && courses.map((_, id) => (
                <div
                  key={id}
                  className={"dot" + (id === courseIndex ? " active" : "")}
                ></div>
              ))}
            </div>  
          </div>
        <button onClick={() => handleScroll(1)}><i className='fa fa-arrow-right'></i></button>
      </div>
      <button onClick={() => handleGetCourses()}></button>
    </div>
  )
}
