import React,{useState,useEffect} from 'react';
import Select from 'react-select'
import Navbar from '../../global_ui/navbar/navbar.js';
import Card from '../../global_ui/card/card.js'
import Button from '../../global_ui/buttons/button'
import './classListHod.css';
import {useAuth} from '../../context/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { getSubjects } from '../services/facultyServices';





const HODClassList = () => {
  const [multiHod,setMultiHod] = useState(false)
  const [subs,setSubs] = useState()
  const {currentUser} = useAuth(); 
  // console.log(currentUser);
  useEffect(()=>{
    const fetchSubjects = async ()=>{

     const res = await getSubjects('cse@vbithyd.ac.in')
     console.log(res);
      if(res === -1){
        //display error
      }else{
        setSubs(res)

      }
    }
    fetchSubjects()
    console.log(subs)

  },[])
  async function getRoles(email){
    const docRef = doc(db, "faculty",email);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if(docSnap.data()["role"][2].slice(0,5) === "MTech"){
          setMultiHod(true)
          
        }
        return {
          data:docSnap.data()["role"],
          error:null
        }
      } else {
        return {
          data:null,
          error:"Enroll Courses to get details"
        }
      }
    } catch (error) {
      return {
        data:null,
        error:error.code
      }      
    }    
}
getRoles(currentUser.email);
 
  
  const [Course, setCourse] = useState("");
    const [Year, setYear] = useState("");
    
    const [Section, setSection] = useState("");
    const [Subject, setSubject] = useState("");
    const Deadlines = [{class:'2_CSM_B_Software Engineering', mid1:'22-3-21', mid2:''},
                     {class:'2_CE_A_Engineering Mechanics', mid1:'22-3-21', mid2:''},
                     {class:'2_Engineering Mechanics', mid1:'22-3-21', mid2:''}];
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
      { value: "B.TECH", label: "B.Tech" },
      { value: "M.TECH", label: "M.Tech" },
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
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
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
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
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
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
        <p className="dep-title">View Department Grades</p>
        <div className="hod-dd">
        {multiHod?<div className='xyz'>
        <span className='dd-text'>Course</span>
        <Select
              placeholder=""
              className="course"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
              }}
            />
        </div>:false}
        <div className='xyz'>
        <span className='dd-text'>Year</span>
        <Select
              placeholder=""
              className="year"
              options={Years}
              isDisabled={multiHod?!Course:false}
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