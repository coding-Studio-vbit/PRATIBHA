import React from "react";
import "./card.css";

const CardforInputs = ({
  text,  
}) => {
  return (
    <div className={`card-container`}>
      {text && <p>{text}</p>}
    </div>
  );
};

export default CardforInputs;
