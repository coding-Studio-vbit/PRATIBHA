import React from 'react';
import Select from 'react-select'
import Navbar from '../../global_ui/navbar/navbar.js';
import Card from '../../global_ui/card/card.js'
import Button from '../../global_ui/buttons/button'
import '../common/classList.css'
//using common css general classList screen



const hodClassList = () => {
    const dept = 'CSE';

    const classes = [{class:'3_CSE_D_PPS',id:0},{class:'2_IT_A_CN',id:1},{class:'2_IT_A_CN',id:2},{class:'2_IT_A_CN',id:3},{class:'2_IT_A_CN',id:4},{class:'2_IT_A_CN',id:5}]
    return (  
        <div>
        <Navbar style={{marginBottom:'30px'}} title={dept+" HOD"} logout={true} />
        <h1>Your Classes</h1>
        <div className='div-container' >
        <div className='cards-container'>
        {classes.map(c=>
            c.id<3?<span className='card-container'>
            <Card onClick={()=>{}} text={c.class} /></span>:false
        )}
        </div>
        <div className='cards-container'>
        {classes.map(c=>
            c.id<3?<span className='card-container'>
            <Card onClick={()=>{}} text={c.class} /></span>:false
        )}
        </div>
        </div>
        <h2>{dept} Department</h2>
        <div className='hod-dd'><span><span className='dd-text'>Year</span><Select className='select-dd' />
        </span>
        <span><span className='dd-text'>Section</span><Select className='select-dd' />
        </span>
        <span><span className='dd-text'>Subject</span><Select className='select-dd' /></span></div>
        <Button icon={<i class="fas fa-search"></i>}className='normal' children='View' />

        </div>
    );
}
 
export default hodClassList;