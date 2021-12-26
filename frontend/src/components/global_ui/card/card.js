import React from "react";
import "./card.css";

const Card = ({
  text,  
  onclick
}) => {
  return (
    <div className={`card-container`} onClick={()=>onclick(text)}>
      {text && <p>{text}</p>}
    </div>
  );
};

export default Card;

// Pass parameters like this : <Card text="3_CSE_D_PPS" onclick={console.log('clicked')}/>
