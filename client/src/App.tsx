import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router";
import { useState, useEffect } from 'react';
import Register from './pages/auth/Register'; 
import Login from './pages/auth/Login';
import Users from './pages/explore/Users';
import Teachers from './pages/explore/Teachers';
import UserDetails from './pages/details/UserDetails.js';
import CourseDetails from './pages/details/CourseDetails.js';
import ProtectedRoute from "./pages/misc/ProtectedRoute";
import ApiClient from './services/apiClient.js';
import UserService from './services/userService.js';
import ReviewService from './services/reviewService.js';
import SocketService from './services/socketService.js';

import type { Credentials, HTTPResponse } from './common/commonTypes.js';
import Layout from './pages/layout/Layout.js';

import Cookies from "js-cookie";
import MyCoursesTeacher from "./pages/explore/MyCoursesTeacher.js";
import PeerService from "./services/peerService.js";
import ValidateMeet from "./pages/meeting/ValidateMeet.js";
import type { IUser } from "../../server/src/db/model/userModel.js";
import Courses from "./pages/explore/Courses.js";

function Home() {
  return(
    <div className="section">
      <h1>Home</h1>
    </div>
  ) 
}


const apiClient = new ApiClient("http://localhost:8080"); 
const userService = new UserService(apiClient);
const reviewService = new ReviewService(apiClient);
const socketService = new SocketService();
const peerService = new PeerService();


export default function App() {
  const [user, setUser] = useState<IUser | null>(null);

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user) || null);
    }
    setLoading(false);
    
  }, []);

  const handleLogout = () => {
    apiClient.clearToken();
    setUser(null);
  }

  const handleLogin = async (credentials: Credentials): Promise<void> => {
      const user = await userService.login(credentials);
      setUser(user);
  }

  const handleRegister = async (user: Omit<IUser,'_id'>): Promise<void> => {
      const new_user = await userService.register(user);
      setUser(new_user);
  }

  async function fetchEntitys<T>(entityType: string, filter?: Record<string, any>): Promise<T[]> {
    return apiClient.findAll<T>(entityType, filter);
  }

  async function fetchEntity<T>(entityType: string, id: string): Promise<T> {
    return apiClient.findById<T>(entityType, id);
  }

  async function createEntity<V>(entityType:string, entity: Omit<V, '_id'>): Promise<V>{
    return apiClient.create(entityType, entity);
  }
  
  async function updateEntity<V>(entityType: string, entity: V): Promise<V> {
    return apiClient.update<V>(entityType, entity);
  }
  
  async function deleteEntity<V>(entityType: string, id: string): Promise<V> {
    return apiClient.deleteById<V>(entityType, id);
  }

  async function validateMeet(id: string): Promise<HTTPResponse> {    
    return apiClient.request<HTTPResponse>(`auth/validate-meet`, {
      method: "POST",
      body: JSON.stringify({ id }),
    })
  }

  async function handleStartMeet(id: string): Promise<void> {
    return apiClient.request(`api/start-meet`, {
      method: "POST",
      body: JSON.stringify({ id }),
    })
  }

  useEffect(()=>{
    console.log(user);
  }, [user])

  if(loading) {
    return <h1>Loading...</h1>
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout user={user} onLogout={handleLogout} onLogin={handleLogin} onRegister={handleRegister}/>}>
          <Route index element={<Home/>}/>

          {/* admin */}
          <Route>
            <Route element={<ProtectedRoute user={user!} isAllowed={!!user && user.roles.includes('admin')} apiClient={apiClient}/>}>
              <Route path="users" element={<Users fetchUsers={fetchEntitys} onDelete={deleteEntity} onEditUser={updateEntity}/>} />
              <Route path="users/:id" element={<Users fetchUsers={fetchEntitys} onDelete={deleteEntity} onEditUser={updateEntity}/>} />
            </Route>
          </Route>

          {/* general */}
          <Route element={<ProtectedRoute user={user!} apiClient={apiClient}/>}>
            <Route path='courses' element={ <Courses fetchCourses={fetchEntitys}/>} />
            <Route path='teachers' element={ <Teachers fetchTeachers={fetchEntitys}/>} />
            <Route path='teachers/:id' element={<UserDetails onFetch={fetchEntity} onUpdate={updateEntity} view='USER' />} />
            <Route path="courses/:id" element={ <CourseDetails onFetchCourse={fetchEntity} onDeleteLesson={deleteEntity} onFetchLessons={fetchEntitys} onCreateLesson={createEntity} onUpdateCourse={updateEntity} onStartMeet={handleStartMeet}/> } />
          </Route>

          {/* teacher */}
          {user && user.roles.includes('teacher') ? 
            <Route element={<ProtectedRoute user={user} apiClient={apiClient}/>}>
              <Route path="/courses/my" element={ <MyCoursesTeacher onFetchCourses={fetchEntitys} onCreate={createEntity} onDelete={deleteEntity}/> } />
            </Route>
          :
            <Route element={<ProtectedRoute user={user!} apiClient={apiClient}/>}>
              <Route path="/courses/my" element={ <MyCoursesTeacher onFetchCourses={fetchEntitys} onCreate={createEntity} onDelete={deleteEntity}/> } />
            </Route>
          }


          {/* <Route path="/meet/:lessonId" element={<ValidateMeet />} /> */}
          <Route element={<ProtectedRoute user={user!} apiClient={apiClient}/>}>
            <Route path="/meet/:lessonId" element={<ValidateMeet socketService={socketService} peerService={peerService} onValidate={validateMeet}/>} />
          </Route>
          
          <Route path="/*" element={ <Navigate to={'/'}/> } />

        </Route>
      </Routes>
    </Router>
  );
}