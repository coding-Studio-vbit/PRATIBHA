import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'


const Navbar = ({title,back=true,logout=false,pra = false}) => {
    /*logout, pra is disabled by default, give logout={true}/pra={true} to use it
    give title='' to rename title in the navbar*/
   const navigate = useNavigate()
    return (
        <div>
        <nav className="nav">
        {back &&   (  <button className="bck">
        <i className="fas fa-arrow-left">
        </i></button>)}
    
        <span className='title' >{title}</span>
        {(logout===true?<button className="btn">
        <i className="fas fa-power-off"></i>
        </button>:pra === true?<button
        onClick={()=>navigate('/faculty/createPra')}
        className='btn'><i class="fas fa-plus"></i> <span id="hide">NEW PRA</span></button>:false)}
        </nav>
        </div>
    );
}
 
export default Navbar;

//example :  <Navbar title='Pranchal' logout={false} />