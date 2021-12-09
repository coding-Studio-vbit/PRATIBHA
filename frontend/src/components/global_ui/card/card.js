import React from "react";
import "./card.css";

const Card = ({
  text,  
  onclick
}) => {
  return (
    <div className={`card-container`} onClick={onclick}>
      {text && <p>{text}</p>}
    </div>
  );
};

export default Card;
