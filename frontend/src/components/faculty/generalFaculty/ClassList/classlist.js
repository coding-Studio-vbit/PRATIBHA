import React from 'react';
import Navbar from '../../../global_ui/navbar/navbar'
import Card from '../../../global_ui/card/card.js'
import './classList.css'


const ClassList = () => {

    
    const BTechClasses = ['2_CSM_B_Software Engineering', '3_CSB_A_Compiler Design', '2_CE_A_Engineering Mechanics']
    const MBAClasses=['2_Engineering Mechanics']
    const MTechClasses=[,'2_CE_A_Engineering Mechanics','1_CSE_A_Engineering Mechanics']
    
    
    function handleCard(){
        //take them to the ListOfStudents screen of the clicked class
    }
    
    return (<div style={{
        width:'100vw'
    }} >
        <Navbar title='Your Classes' logout={true}/>
        <div className='div-container-classes'>
        {BTechClasses.length !== 0 && (
            <span >

                  <h4> B.Tech</h4>
                    {BTechClasses.map((item) => {
                      return <Card classname='card-container' text={item}/>;
                    })}
            
            </span>

                
              )}
              {MTechClasses.length !== 0 && (
              <span >
                  <h4> M.Tech</h4>
                    {MTechClasses.map((item) => {
                      return <Card classname='card-container' text={item}/>;
                    })}
                  
              </span>
              
              
              )}
              {MBAClasses.length !== 0 && (
         <span >

                  <h4>MBA</h4>
                    {MBAClasses.map((item) => {
                      return <Card classname='card-container' text={item}/>;
                    })}
         </span>
            
              )}
        
        
        

        
        </div>
        
        </div>);
}
 
export default ClassList;