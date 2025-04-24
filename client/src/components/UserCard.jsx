import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "./UserCard.css"
import DeleteBtn from './DeleteBtn'
import Report from './Report'


export default function UserCard({ user, myId, you=false, admin=false, handleDelete, confirmId, setConfirm }) {
    
  return (
    <div className={'user-card ' + user.role}>
        <div className="info">
            <h5 className='role'>{user.role}</h5>
            <h2 className='name'>{user.username}</h2>
            <h3 className='email'>{user.email}</h3>
        </div>
        <div className="actions">
            {admin && <DeleteBtn userId={user._id} handleDelete={handleDelete} you={you} confirmId={confirmId} setConfirm={setConfirm}/>}
            <Report fromUser={myId} toUser={user._id} admin={admin} />
            <Link className='details' to={'/users/'+user._id}>Details</Link>
        </div>
    </div>
  )
}
