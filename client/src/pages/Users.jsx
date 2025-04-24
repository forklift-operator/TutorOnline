import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import UserCard from '../components/UserCard';
const API_URL = import.meta.env.VITE_API_URL;

export default function Users({ myId }) {
    const [users, setUsers] = useState([]);
    const [confirmId, setConfirm] = useState('');

    function handleDelete(id){
        fetch(`${API_URL}/api/users/${id}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'),
                "ngrok-skip-browser-warning": 1,
            },
            method: "DELETE",
            
        })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.json(); 
                throw new Error(`Error deleting user: ${text.error}`);
            }
            return res.json();
        })
        .then((data) => {
            setUsers(users.filter(user => user._id !== id));
        }).catch((error) => {console.error(error)})
    }
    

    function handleRefresh(){
        fetch(`${API_URL}/api/users`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "token": Cookies.get('token'), 
                "ngrok-skip-browser-warning": 1,
            },
            method: "GET",

        })
        .then(async (res) => {
            if (!res.ok) {
                const response = await res.json(); 
                throw new Error(response.message);
            }
            return res.json();
        })
        .then((data) => {
            setUsers(data);
        }).catch((error) => {console.error(error)})
    }
    
    useEffect(() => {
        handleRefresh();
    },[])


    useEffect(() => {
        console.log("Users:", users);
    }, [users]);

    
  return (
      <div className="users">

        <h2>Users</h2>
        <button onClick={() => {handleRefresh()}}>Refresh</button>
        <div className="user-cards">
            {users.map((user) => {
                return (
                    <UserCard 
                    key={user._id}
                    user={user}
                    myId={myId} 
                    you={myId === user._id}
                    admin={true}
                    handleDelete={handleDelete}
                    confirmId={confirmId}
                    setConfirm={setConfirm}/>
                );
            })}
        </div>
    </div>
  )
}
