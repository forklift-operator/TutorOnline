import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import "./CourseCard.css"
const API_URL = import.meta.env.VITE_API_URL;

export default function CourseCard({ status, course, onDelete, onCreateLesson, onJoin }) {
    const navigate = useNavigate();
    const [newLessonModal, setNewLessonModal] = useState(false);
    const [newLessonInfo, setNewLessonInfo] = useState({name:"", description: ""});

    const handleCloseModal = () => {
        setNewLessonModal(false);
        setNewLessonInfo({ name: "", description: "" });
    }

    const handleCreateLesson = (e) => {
        e.preventDefault();
        onCreateLesson(course._id, newLessonInfo);
        setNewLessonModal(false);
        setNewLessonInfo({ name: '', description: '' });
    }
     
    const handleLessonChange = (e) => {
        const selectedLessonId = e.target.value;
        if (selectedLessonId) {
            navigate(`/lesson/${selectedLessonId}`);
        }
    }

    const handleJoinMeeting = (courseId, lessonId, isOpen=true) => {
        onJoin(courseId, lessonId, isOpen);
    }

  return (
    <div className="course-card">
        <div className="card-header">
            <h2 className="course-name">{course.name}</h2>
            <div className="actions">
                <button><i className="fa fa-user"></i></button>
                <button><i className="fa fa-edit"></i></button>
                <button onClick={() => onDelete(course._id)}><i className="fa fa-trash"></i></button>
            </div>
        </div>
        <div className="description-container">
            <h3>Description</h3>
            <p>{course.description ? course.description : "No description"}</p>
        </div>
        <div className="students">
            <h3>Students</h3>
            {/* the num of students or sumthing else */}
        </div>
        <div className="actions">
            <button>Details</button>
        </div>
        <div className="rating">
            <h3>Rating</h3>
            {/* stars of rating */}
        </div>
        <div className="join-lesson">
            {course.lessons.length === 0 ? 
                (status.role === "Teacher" &&
                    <button className='join' onClick={() => setNewLessonModal(true)}>Create lesson <i className='fa fa-headphones'></i></button>
                )
                :
                <div className="lessons-container">
                    <select className='previous-lessons'defaultValue="" onChange={(e) => handleLessonChange(e)}>
                        <option disabled value="">Previous lessons</option>
                        {course.lessons.map(lesson => (
                            <option key={lesson._id} value={lesson._id}>{lesson.name}</option>
                        ))}
                    </select>
                    {course.lessons[0] && course.lessons[0].isOpen ?
                        <button onClick={() => handleJoinMeeting(course._id, course.lessons[0]._id)} className='join'>Join meeting for {course.lessons[0].name}</button>
                    
                    :
                        <button onClick={() => handleJoinMeeting(course._id, course.lessons[0]._id)} className='join'>Make a meeting for {course.lessons[0].name}</button>
                    }
                </div>
            }
        </div>
        {newLessonModal && 
            <div className="modal-overlay">
                <div className="modal">
                    <button className="close-button" onClick={() => handleCloseModal()}>✖</button>
                    <div className="new-lesson">
                        <form onSubmit={(e) => handleCreateLesson(e)}>
                            <h3>New lesson</h3>
                            <input className="name" type="text" onChange={(e) => setNewLessonInfo({ ...newLessonInfo , name: e.target.value })} placeholder="Lesson name" value={newLessonInfo.name} />
                            <input className="description" type="text" onChange={(e) => setNewLessonInfo({ ...newLessonInfo , description: e.target.value })} placeholder="Description" value={newLessonInfo.description} />
                            <button className="submit-new-lesson" type="submit">Create</button>
                        </form>
                    </div>        
                </div>
            </div>
        }
    </div>
  )
}
