import React from "react";
import "./card.css";

const Card = ({
  text, 
  klass,
  subText,
  onclick,
  children,onClickchildren
}) => {
  return (
    <div className="globalCardContainer"  onClick={()=>onclick(klass)}>
    {children&& <span className="delicon" onClick={function(e){
          e.stopPropagation()
          onClickchildren(klass)}
      }>{children}</span>}
    {text && <p>{text}</p>}
      {subText && <p className="subText" style={{fontSize:'15px',fontWeight:'bold'}}>{subText}</p>}
    </div>
  );
};

export default Card;























// Pass parameters like this : <Card text="3_CSE_D_PPS" onclick={console.log('clicked')}/>
