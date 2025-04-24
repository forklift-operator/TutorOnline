import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate
} from "react-router-dom";
import Cookies from 'js-cookie'

export default function Header({ status, setStatus }) {

  return (
      <nav className='header'>
        <Link className='link' to="/">Home</Link>
        <Link className='link' to="/my-courses">My Courses</Link>
        <Link className='link' to="/chat">Chat</Link>
        {status.logged ? (
          <>
            {status.role === "Admin" ? 
              <Link className='link' to="/users">Users</Link>
            :
              <Link className='link' to='/teachers'>Teachers</Link>
            }

            <button onClick={() => {
              Cookies.remove('token');
              setStatus({ logged: false, id: '', role: '' });
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link className='link' to="/login">Login</Link>
            <Link className='link' to="/sign-up">Signup</Link>
          </>
        )}
      </nav>
  );
}