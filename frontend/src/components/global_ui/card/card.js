import React from "react";
import "./card.css";

const Card = ({
  text,  
  onclick,
  subtext
}) => {
  return (
    <div className={`card-container`} onClick={onclick}>
      <div className='text-container'>
      {text && <p>{text}</p>}
      <span className='sub-text'>{subtext}</span>
      </div>
    </div>
  );
};

export default Card;

// Pass parameters like this : <Card text="3_CSE_D_PPS" onclick={console.log('clicked')}/>
