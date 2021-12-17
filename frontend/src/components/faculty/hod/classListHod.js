import React,{useState} from 'react';
import Select from 'react-select'
import Navbar from '../../global_ui/navbar/navbar.js';
import Card from '../../global_ui/card/card.js'
import Button from '../../global_ui/buttons/button'
import './classListHod.css';




const HODClassList = () => {
    const [Year, setYear] = useState("");
    
    const [Section, setSection] = useState("");
    const [Subject, setSubject] = useState("");
    const dept = 'CSE';
    const Years = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ];
      const Sections = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
      ];
      const Subjects = [
        { value: "PPS", label: "PPS", link: "CSE" },
        {
          value: "Software Engineering",
          label: "Software Engineering",
          link: "CSE",
        },
        { value: "Compiler Design", label: "Compiler Design" },
        {
          value: "Engineering Mechanics",
          label: "Engineering Mechanics",
        },
      ];
    

    const classes = [{class:'3_CSE_D_PPS',id:0},{class:'2_IT_A_CN',id:1},{class:'2_IT_A_CN',id:2},{class:'2_IT_A_CN',id:3},{class:'2_IT_A_CN',id:4},{class:'2_IT_A_CN',id:5}]
    return (  
        <div>
        <Navbar style={{marginBottom:'30px'}} title={dept+" HOD"} logout={true} />
        <h1>Your Classes</h1>
        <div className='div-container-classes' >
  
        {classes.map(c=>
            c.id<3?
            <Card onClick={()=>{}} text={c.class} />:false
        )}
       
        {classes.map(c=>
            c.id<3?
            <Card onClick={()=>{}} text={c.class} />:false
        )}
       
        </div>
        <h2>{dept} Department</h2>
        <div className="hod-dd">
        <div className='xyz'>
        <span className='dd-text'>Year</span>
        <Select
              placeholder=""
              className="year"
              options={Years}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
        </div>
        <div className='xyz'>
        <span className='dd-text'>Section</span>
        <Select
              placeholder=""
              options={Sections}
              isDisabled={!Year}
              onChange={(selectedSection) => {
                setSection(selectedSection);
              }}
            />
        </div>
        <div className='xyz'>
        <span className='dd-text'>Subject</span>
        <Select
              placeholder=""
              options={Subjects}
            isDisabled={!Section}
              onChange={(selectedSubject) => {
                setSubject(selectedSubject);
              }}/></div>
        </div>
        <Button icon={<i class="fas fa-search"></i>}className='normal' children='View' />

        </div>
    );
}
 
export default HODClassList;