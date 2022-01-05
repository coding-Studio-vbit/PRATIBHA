import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./stylecard.css";

const Card_ = ({
  subject,
  pra,
  status,
  date,
//   klass,
}) => {
    let navigate = useNavigate();
    const location = useLocation();
  return (
    <div className={`CardContainer`} 
    // onClick={({currentuser, subject}) => {
    //     navigate("/student/uploadPRA", {
    //         state: {
    //           rollno: currentuser,
    //           subject: subject,
    //         },
    //       });
    // }}
    >
      {subject && <p className="newcardtitle" style={{color: "#0E72AB", fontWeight:'bold'}}>{subject}</p>} 
      {pra && <p className="newcard"><b>Topic: </b>{pra}</p>} 
      {status && <p className="newcard"><b>Status: </b>{status}</p>} 
      {date && <p className="newcard"><b>Submit Before: </b>{date}</p>} 
    </div>
  );
};

export default Card_;
