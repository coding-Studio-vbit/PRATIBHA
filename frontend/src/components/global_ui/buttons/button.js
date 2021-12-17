import React from "react";
import "./button.css";

const Button = ({ children, disabled, onClick, width, height, icon, className }) => {
  return (
    <button
      className={`root ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={onClick} disabled={disabled}
    >
      {" "}
      {icon ? <span>{icon}</span> : null} {children ? children : null}
    </button>
  );
};

export default Button;

//without any icon do this : <Button children='Pranchal'/>
//with icon do this :   <Button className="done-button" icon ={<i class="fas fa-search"></i>} children ='Pranchal' />
//default height and width, check in .css but if you want to override those then do this :  <Button width='100' height='100' children='Pranchal'/>
// for normal buttons, (dark blue) use className 'normal' like this : <Button icon={<i class="fas fa-file-export"></i>} children="EXPORT" className="normal" width="150"/>
//for rare buttons, (light blue) use className 'rare' like this :  <Button icon={<i class="fas fa-file-export"></i>} children="EXPORT" className="rare" width="150"/>
       