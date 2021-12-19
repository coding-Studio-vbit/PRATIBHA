import React,{useState} from 'react';
import Select from 'react-select'
import Navbar from '../../global_ui/navbar/navbar.js';
import Card from '../../global_ui/card/card.js'
import Button from '../../global_ui/buttons/button'
import './classListHod.css';




const HODClassList = () => {
  const [Course, setCourse] = useState("");
    const [Year, setYear] = useState("");
    
    const [Section, setSection] = useState("");
    const [Subject, setSubject] = useState("");
    const BTechClasses = [
      "2_CSM_B_Software Engineering",
      "3_CSB_A_Compiler Design",
      "2_CE_A_Engineering Mechanics",
    ];
    const MBAClasses = ["2_Engineering Mechanics"];
    const MTechClasses = [
      "2_CE_A_Engineering Mechanics",
      "1_CSE_A_Engineering Mechanics",
    ];
  
    const[button,setButton]=useState(true);
    const dept = Course.value;
    const Courses = [
      { value: "B.TECH", label: "B.TECH" },
      { value: "M.TECH", label: "M.TECH" },
      { value: "MBA", label: "MBA" }
    ];
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
    function handleClick(){
      console.log(Course.value+'_'+Year.value+'_'+Section.value+'_'+Subject.value);
    }

  function handleCard(){
    
  }
    return (  
        <div className='root-hod'>
        <Navbar style={{marginBottom:'30px'}} title={dept!==undefined ?dept+" HOD":"HOD"} logout={true} />
        <p className="dep-title">Your Classes</p>
        <div className="div-container-classesHOD">
       
        {BTechClasses.length !== 0 && (
          <div>
            <h4> B.Tech</h4>
            <div className="card-flex">
              {BTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MTechClasses.length !== 0 && (
          <div>
            <h4> M.Tech</h4>
            <div className="card-flex">
              {MTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MBAClasses.length !== 0 && (
          <div>
            <h4>MBA</h4>
            <div className="card-flex">
              {MBAClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
        <p className="dep-title">View Department Grades</p>
        <div className="hod-dd">
        <div className='xyz'>
        <span className='dd-text'>Course</span>
        <Select
              placeholder=""
              className="course"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
              }}
            />
        </div>
        <div className='xyz'>
        <span className='dd-text'>Year</span>
        <Select
              placeholder=""
              className="year"
              options={Years}
              isDisabled={!Course}
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
                setButton(false)
              }}/></div>
        </div>
        <span className="view-style"><Button icon={<i class="fas fa-search"></i>}className='normal hod-button' disabled={button}  onClick={handleClick} children='View' />
        </span>
        </div>
    );
}
 
export default HODClassList;