import React from "react";
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

  return (
    <div
      className={
        isSubmitted
          ? `CardContainer green`
          : isWeek
          ? `CardContainer red`
          : `CardContainer`
      }
      // onClick={({currentuser, subject}) => {
      //     navigate("/student/uploadPRA", {
      //         state: {
      //           rollno: currentuser,
      //           subject: subject,
      //         },
      //       });
      // }}
    >
      {subject && (
        <p
          className="newcardtitle"
          style={{ color: "#0E72AB", fontWeight: "bold" }}
        >
          {subject}
        </p>
      )}
      {pra && (
        <p className="newcard">
          <b>Topic: </b>
          {pra}
        </p>
      )}
      {status && (
        <p className="newcard">
          <b>Status: </b>
          {status}
        </p>
      )}
      {date && (
        <p className="newcard">
          <b>Submit Before: </b>
          {date}
        </p>
      )}
    </div>
  );
};

export default Card_;
