import Select from 'react-select'
import React from 'react';
import Navbar from '../../global_ui/navbar/navbar.js'
import './createPra.css'
import Button from '../../global_ui/buttons/button.js'






const CreatePra = () => {

    

    
    return ( 
        <div>
        <Navbar title="CREATE NEW PRA" pra={true} />
        <div className="div-container">
        <span className="text-style">Enter instructions (if any):</span>
        <input className="span-style" onChange={() => {}}></input>
        <span className="text-style2">Set PRA Deadline:
        <span><Select className='select-dd' /></span>
        </span>
        <span style={{marginTop:30}}><Button className='normal' icon={<i class="fas fa-plus"></i>} onClick={()=>{}} children={'Create'}/></span>
        </div>
        
        
        
        
        
        
        </div>
     );
}
 
export default CreatePra;