import React from 'react';
import './navbar.css'


const Navbar = ({title,logout=true}) => {
    /*logout is enabled by default, give logout={false} to hide it
    give title='' to rename title in the navbar*/

    return (
        <div>
        <nav className="nav">
        <button className="bck">
        <i1 class="fas fa-arrow-left">
        </i1></button>
        {title}
        {(logout!==false?<button className="btn">
        <i2 class="fas fa-power-off"></i2>
        Logout</button>:false)}
        </nav>
        </div>
    );
}
 
export default Navbar;