import React from 'react';
import './navbar.css'
import { useAuth } from '../../context/AuthContext';


const Navbar = ({title,logout,pra = false, onBackBtnPressed}) => {
    const {signOut} =useAuth();
    /*logout, pra is disabled by default, give logout={true}/pra={true} to use it
    give title='' to rename title in the navbar*/

    return (
        <div>
        <nav className="nav">
        {
           onBackBtnPressed && 
            <button className="bck" onClick={onBackBtnPressed}>
        <i className="fas fa-arrow-left">
        </i></button>}
        <span className='title' >{title}</span>
        {
          logout && 
          <button className="btn">
          <i className="fas fa-power-off" onClick={signOut}></i>
          </button>}
          </nav>
        </div>
    );
}
 
export default Navbar;

//example :  <Navbar title='Pranchal' logout={false} />