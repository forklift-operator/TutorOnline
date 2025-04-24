export default function DeleteBtn({ userId, handleDelete, you=false, confirmId, setConfirm}) {
  return (
        <>
        {!you ?
            <>
            {confirmId === userId ? 
                <div className='confirmation'>
                    <button className='confirm' onClick={() => {handleDelete(userId)}}>Confirm</button>
                    <button className='cancel' onClick={() => {setConfirm('')}}>Cancel</button>
                </div> :
                <button className='delete' onClick={() => {setConfirm(userId)}}>Delete</button>
            }
        </> : <button>YOU</button>
        }
        </>
  )
}
