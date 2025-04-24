import { useState } from "react"
import Cookies from "js-cookie"
import "./Report.css"
const apiUrl = import.meta.env.VITE_API_URL;

export default function Report({ fromUser, toUser, admin=false }) {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userReports, setUserReports] = useState([]);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (admin) getReports(toUser);
  }
  
  const handleCloseModal = () => {
    setUserReports([]);
    setSubject("");
    setText("");
    setIsModalOpen(false);
  }
  
  function handleReportSubmit(e) {
    e.preventDefault();

    if (subject === "" || text === "") {
      alert("Empty fields on the report")
    }
    else{
      fetch(`${apiUrl}/api/report`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "token": Cookies.get('token'), 
          "ngrok-skip-browser-warning": 1,
      },
      method: 'POST',
      body: JSON.stringify({ fromUser, toUser, subject, text })
      }).then(async (res) => {
        console.log(res);
        
        if (!res.ok) {
          const text = await res.json();
          throw new Error(text.message)
        }
        return res.json();
      }).catch((e) => console.error(e))

      handleCloseModal();
    }

  };

  function getReports(id) {
    
    fetch(`${apiUrl}/api/reports/${id}`, {
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "token": Cookies.get('token'), 
        "ngrok-skip-browser-warning": 1,
      },
      method: 'GET',
    })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.json();
        throw new Error(text.message);
      }
      return res.json();
    })
    .then((data) => {
      setUserReports(data);
    })
    .catch((e) => console.error(e))
  }


  return (
    <>
    <button onClick={()=>handleOpenModal(1)}>
      {admin ? "Report List" : "Report"}
    </button>

    
    {isModalOpen && (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={() => handleCloseModal()}>✖</button>
        <h3>{admin && "User Reports"}</h3>

        {admin ? (
          (userReports.map((report, i) => {
            return(
              <div key={i} className="report-item">
                <h5>{report.subject}</h5>
                <p>{report.text}</p>
              </div>
            )
          }))
        ) : (
          <div className="report">
            <form onSubmit={(e) => handleReportSubmit(e)}>
              <h2>Submit a report</h2>
              <input className="subject" type="text" onChange={(e) => setSubject(e.target.value)} placeholder="Subject" value={subject} />
              <input className="issue" type="text" onChange={(e) => setText(e.target.value)} placeholder="The issue you have with this user" value={text} />
              <button className="submit-report" type="submit">Report</button>
            </form>
          </div>
        )}

      </div>
    </div>
    )}
    </>
  )
}