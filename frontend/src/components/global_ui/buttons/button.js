import React from 'react';
 import "./button.css";                     
                                                               


 const Button = ({children,icon,type,onClick,buttonStyle,buttonSize}) => {
    return (
        <button className = "root" onClick = {onClick} type = {type}> {icon}{children}</button>
    )
}

export default Button;