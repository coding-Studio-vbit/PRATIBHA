import React,{useEffect, useState} from 'react';
import Select from 'react-select'
import Navbar from '../../global_ui/navbar/navbar.js';
import Card from '../../global_ui/card/card.js'
import Button from '../../global_ui/buttons/button'
import './classListHod.css';
import { useAuth } from '../../context/AuthContext.js';
import { fetchSectionsAndSubs } from '../services/facultyServices.js';
import { useNavigate } from 'react-router-dom';




const HODClassList = () => {
  const [Course, setCourse] = useState({ value: "Loading", label: "Loading" });
    const [Year, setYear] = useState("");
    const {currentUser} = useAuth()
    const [Section, setSection] = useState("");
    const [Subject, setSubject] = useState("");
    const nav = useNavigate()
    const [klass,setKlass] = useState(
      [{ value: "Loading", label: "Loading" }],

    )
    const [dep,setDep ]  = useState('')
    const [department,setDepartment] = useState(
      [{ value: "Loading", label: "Loading" }],

    )
    const [subjects,setSubjects] = useState(
      [{ value: "Loading", label: "Loading" }],

    )
    const [sections,setsections] = useState(
      [{ value: "Loading", label: "Loading" }],

    )
    useEffect(()=>{
      let klasses = []
      let departments = []
      for(let i=0;i<currentUser.roles.length;i++){
        const parts = currentUser.roles[i].split('_')
        klasses.push({value:parts[0],label:parts[0]})
        departments.push({value:parts[1],label:parts[1]})
      }
      setKlass(klasses)
      setDepartment(departments)


    },[])

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
 
    
    const Years = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ];
      const MYears = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },

      ];

    function handleClick(){
      console.log(Course.value+'_'+Year.value+'_'+Section.value+'_'+Subject.value);
      nav('/faculty/viewsubmissions',{state:{
        Course:Course.value,
        Year:Year.value,
        Dept:dep.value,
        Section:Section.value,
        Subject:Subject.value
      }})
    }

  function handleCard(){
    
  }
    return (  
        <div className='root-hod'>
        <Navbar style={{marginBottom:'30px'}} title={"HOD"} back = {false} logout={true} />
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
              options={klass}
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
              options={Course.value[0]==='M'?MYears: (currentUser.isFirstYearHOD)?[Years[0]]:[Years[1],Years[2],Years[3]]}
              isDisabled={!Course}
              onChange={ async (selectedYear)  => {
                setYear(selectedYear);
                const res  = await fetchSectionsAndSubs(Course.value,selectedYear.value,department)
                setSubjects(res.subjects)
                setsections(res.sections)

              }}
            />
        </div>

        <div className='xyz'>
        <span className='dd-text'>Department</span>
        <Select
              placeholder=""
              className="department"
              options={department}
              isDisabled={!Year}
              onChange={ async (d)  => {
                setDep(d);
                

              }}
            />
        </div>

        <div className='xyz'>
        <span className='dd-text'>Section</span>
        <Select
              placeholder=""
              options={sections[dep.value]}
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
              options={subjects[dep.value]}
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