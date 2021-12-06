import React from 'react';
 import "./button.css";                                                                                    


export const Button = ({children,icon,type,onClick,buttonStyle,buttonSize}) => {
    return (
        <button className = "root" onClick = {onClick} type = {type}> {icon}{children}</button>
    )
}