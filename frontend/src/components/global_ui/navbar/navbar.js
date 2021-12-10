import React from 'react';
import './navbar.css'


const Navbar = ({title,logout=true}) => {
    /*logout is enabled by default, give logout={false} to hide it
    give title='' to rename title in the navbar*/

    return (
        <div>
        <nav className="nav">
        <button className="bck">
        <i className="fas fa-arrow-left">
        </i></button>
        {title}
        {(logout!==false?<button className="btn">
        <i className="fas fa-power-off"></i>
        </button>:false)}
        </nav>
        </div>
    );
}
 
export default Navbar;