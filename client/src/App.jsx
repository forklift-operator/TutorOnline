const API_URL = import.meta.env.VITE_API_URL;

console.log("Backend: ",API_URL);

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate
} from "react-router-dom";
import { useState, useEffect } from 'react';
import Signup from './components/Signup.jsx'; 
import Login from './components/Login.jsx';
import Users from './pages/Users.jsx';
import Header from './components/Header.jsx';
import Teachers from './pages/Teachers.jsx';
import UserDetails from './pages/UserDetails.jsx';
import ChatRooms from './pages/ChatRooms.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import MyCoursesTeacher from './pages/MyCoursesTeacher.jsx';
import Cookies from 'js-cookie'
import './App.css' 

// excalidraw
import Chat from './pages/Chat.jsx';
import ValidateMeet from './pages/ValidateMeet.jsx';
// import Whiteboard from './components/whiteb/Whiteboard.jsx'


function Home() {
  return(
    <h1>Home</h1>
    // <Whiteboard/>
  ) 
}

function About() {
  return <h2>About</h2>;
}

export default function App() {

  const [status, setStatus] = useState({ logged: false, id: '', username: '', role: '' });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      fetch(`${API_URL}/api/login-status`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': token,
          "ngrok-skip-browser-warning": 1,
        },
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
          if (data.logged) {
            setStatus({ logged: true, id: data.id, username:data.username, role: data.role });
            setLoading(false);
          } 
        })
        .catch(error => console.error('Error:', error));
    }
    else setLoading(false);
  }, []);

  useEffect(()=>{
    console.log(status);
  }, [status])

  if(loading) {
    return
  }

  return (
    <Router>
      <Header status={status} setStatus={setStatus}/>
      <div className="sections">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/my-courses" element={status.role ==="Teacher" ? <MyCoursesTeacher status={status} myId={status.id} /> : <Navigate to="/" />} />
          <Route path="/users" element={status.logged && status.role === "Admin" ? <Users status={status} myId={status.id}/> : <Navigate to="/" />} />
          <Route path="/teachers" element={status.logged ? <Teachers status={status} myId={status.id}/> : <Navigate to="/" />} />
          <Route path="/sign-up" element={ <Signup setStatus={setStatus}/> } />
          <Route path="/login" element={<Login setStatus={setStatus}/>} /> 
          <Route path="/users/:id" element={status.logged ? <UserDetails /> : <Navigate to="/" />} />
          <Route path="/chat/" element={status.logged ? <ChatRooms/> : <Navigate to="/" />} />
          <Route path="/meet/:courseId/:lessonId" element={status.logged ? <ValidateMeet status={status}/> : <Navigate to="/" />} />
          <Route path="/course/:courseId" element={status.logged ? <Course status={status}/> : <Navigate to="/" />} />
          <Route path="/lesson/:lessonId" element={status.logged ? <Lesson status={status}/> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}