import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";


const Navbar = ({children,title,back=true,logout=false,pra = false}) => {
    /*logout, pra is disabled by default, give logout={true}/pra={true} to use it
    give title='' to rename title in the navbar*/
   const navigate = useNavigate()
    return (
        <div>
        <nav className="nav">
        {back &&   (  <button className="bck">
        <i className="fas fa-arrow-left">
        </i></button>)}
        <div style={{
            flexGrow:1
        }} ></div>
        <span className='title' >{title}</span>
        {(logout===true && <button className="btn">
        <i className="fas fa-power-off"></i>
        </button>)}
        
            <div className='createPRA' style={{
                display:'flex',
                justifyContent:'end',
            }}  >
               

                {children}
            </div>
        
        </nav>
        </div>
    );
}
 
export default Navbar;

//example :  <Navbar title='Pranchal' logout={false} />
