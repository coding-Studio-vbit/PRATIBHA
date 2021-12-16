import React, {useState} from 'react';
import Navbar from '../../global_ui/navbar/navbar.js'
import './createPra.css'
import Button from '../../global_ui/buttons/button.js'
import DatePicker from 'react-date-picker'






const CreatePra = () => {

    const [value,onChange] = useState(new Date());

    

    
    return ( 
        <div>
        <Navbar title="CREATE NEW PRA" />
        <div className="div-container">
        <span className="text-style">Enter instructions (if any):</span>
        <input className="span-style" onChange={() => {}}></input>
        <span className="text-style2">Set PRA Deadline:
        <span><DatePicker format='dd-MM-y' value={value} onChange={onChange} className='select-dd' /></span>
        </span>
        <span style={{marginTop:30}}><Button className='normal' icon={<i class="fas fa-plus"></i>} onClick={()=>{}} children={'Create'}/></span>
        </div>
        
        
        
        
        
        
        </div>
     );
}
 
export default CreatePra;