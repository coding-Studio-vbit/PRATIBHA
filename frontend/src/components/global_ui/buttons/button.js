import React from 'react';
 import "./button.css";                     
                                                               


 const Button = ({children,icon,type,onClick,width,height}) => {
    return (
        <button style={{width:`${width}px`, height:`${height}px`}} className = "root" onClick = {onClick} type = {type}> {icon}{children}</button>
    )
}

export default Button;

{/* <Button width='100' height='100' children='Pranchal'/> */}