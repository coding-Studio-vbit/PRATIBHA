import React from "react";
import "./card.css";

const CardforInputs = ({
  first,
  className,
  iscolor,
  second,
  third,
  fourth,
  fifth,
  sixth,
}) => {
  return (
    <div className={`card-container-${className} ${iscolor}`}>
      {first && <p className="grid-item">{first}</p>}
      {second && <p className="grid-item">{second}</p>}
      {third && <p className="grid-item">{third}</p>}
      {fourth && <p className="grid-item">{fourth}</p>}
      {fifth && <p className="grid-item">{fifth}</p>}
      {sixth && <p className="grid-item">{sixth}</p>}
    </div>
  );
};

export default CardforInputs;
