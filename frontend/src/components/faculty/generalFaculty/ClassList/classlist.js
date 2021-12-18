import React from 'react';
import Navbar from '../../../global_ui/navbar/navbar'
import Card from '../../../global_ui/card/card.js'
import './classList.css'


const ClassList = () => {

    const classes = [{class:'3_CSE_D_PPS',id:0},{class:'2_IT_A_CN',id:1},{class:'2_IT_A_CN',id:2},{class:'2_IT_A_CN',id:3},{class:'2_IT_A_CN',id:4},{class:'2_IT_A_CN',id:5}]
    return (<div style={{
        width:'100vw'
    }} >
        <Navbar title='Your Classes' logout={true}/>
        <div className='div-container-classes'>
        {classes.map(c=>
            c.id<3?
            <span ><Card onClick={()=>{}} text={c.class} /></span>:false
        )}
        {classes.map(c=>
            c.id>=3?
            <Card  onClick={()=>{}} text={c.class} />:false
        )}
        
        
        

        
        </div>
        
        </div>);
}
 
export default ClassList;