import React from "react";
import "./card.css";

const Card = ({
  text, 
  klass,
  subText,
  onclick
}) => {
  return (
    <div className="globalCardContainer"  onClick={()=>onclick(klass)}>
      {text && <p>{text}</p>} 
      {/* <p style={{fontSize:'14px',fontWeight:'bold'}} >{subText? "PRA CREATED":''}</p> */}
      { subText && <p style={{fontSize:'14px',fontWeight:'bold'}} >PRA CREATED</p> }

    </div>
  );
};

export default Card;

// Pass parameters like this : <Card text="3_CSE_D_PPS" onclick={console.log('clicked')}/>
