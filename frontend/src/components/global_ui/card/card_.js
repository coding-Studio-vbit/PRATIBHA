import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./stylecard.css";

const Card_ = ({
  subject,
  pra,
  status,
  date,
  isWeek,
  isSubmitted,
//   klass,
}) => {
    let navigate = useNavigate();
    const location = useLocation();
  return (
    <div className={isWeek ? `CardContainer red`: isSubmitted ? `CardContainer green`:`CardContainer`} 
    // onClick={({currentuser, subject}) => {
    //     navigate("/student/uploadPRA", {
    //         state: {
    //           rollno: currentuser,
    //           subject: subject,
    //         },
    //       });
    // }}
    >
      {subject && <p>{subject}</p>} 
      {pra && <p><b>Topic: </b>{pra}</p>} 
      {status && <p><b>Status: </b>{status}</p>} 
      {date && <p><b>Submit Before: </b>{date}</p>} 
    </div>
  );
};

export default Card_;
