import React, { useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./enroll.css";
import { useAuth } from "../../context/AuthContext";
import { enrollCourse,getCurriculumDetails } from "../services/studentServices";

import {LoadingScreen, Spinner} from '../../global_ui/spinner/spinner';
import Dialog from '../../global_ui/dialog/dialog'
import { useNavigate } from "react-router-dom";

export default function StudentEnroll() {
  const [course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [button, setButton] = useState(true);
  const { currentUser }= useAuth();

  const [courseFlag, setCourseFlag] = useState(false);

  const [oe, setOe] = useState("");
  const [pe, setPe] = useState("");

  const [openElectives, setOpenElectives] = useState(null);
  const [professionalElectives, setProfessionalElectives] = useState(null);
  const [subjects, setSubjects] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);

  const nav = useNavigate();

  async function getSubjects(){
    if(course.value!=null &&  Year.value!=null && Department.value!=null && Section.value!=null){
      setIsLoading(true);
      const res =await getCurriculumDetails({
        course:course.value,
        year:Year.value,
        department:Department.value,
        section:Section.value, 
      });      
      if(res.error==null){
        if(res.document.length===1){
          const result = await enrollCourse(
            currentUser.email,{
              course:course.value,
              year:Year.value,
              department:Department.value,
              section:Section.value,
              isEnrolled:true,
              subjects:res.document[0]
           }
          )
          if(result==null){
            setIsLoading(false);
            setShowDialog("Enrolled Successfully");
          }else{
            setIsLoading(false);
            setShowDialog(result.toString());            
          }
        }else{
          console.log(res.document[1],34);
          console.log(res.document[2],12);
          console.log(res.document[2].map(
            function(a) {
              return  {value:a.subject, label:a.subject} 
            }));
          setOpenElectives(res.document[1]);
          setProfessionalElectives(res.document[2]); 
          setSubjects(res.document[0]);
          setIsLoading(false);  
          setCourseFlag(true);
        } 
      }else{
        setIsLoading(false);
        setShowDialog(res.error);        
      }      
      console.log(course.value+'_'+Year.value+'_'+Department.value+'_'+Section.value);
    }else{
      console.log("Provide Details");
    }
  }

  
  const courses = [
    { value: "BTech", label: "B.Tech" },
    { value: "MTech", label: "M.Tech" },
    { value: "MBA", label: "MBA" },
  ];
  
  const Years = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" }
  ];

  const Departments = [
    //fetch from db
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "CSM",label: "CSE(Artificial Intelligence & Machine Learning)", },
    { value: "CSD", label: "CSE(Data Science)" },
    { value: "CSC", label: "CSE(Cyber Security)" },
    { value: "CSB", label: "Computer Science & Business System" },
    { value: "ECE", label: "Electronics & Communications Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "IT", label: "Information Technology" },

    { value: "MASTERS", label: "Some Eng" },
    { value: "VLSI", label: "VLSI Engineering" },

    { value: "Marketing",label:'Marketing'},
    { value: "Entrepreneurship",label:'Entrepreneurship'},
    { value: "Finance",label:'Finance'},
  ];
  const Sections = [
    //fetch from db
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const yearsList=(type)=>{
    if(type==="BTech" ){
      return Years;
    }else if(type==='MBA' || type==="MTech"){
      return Years.slice(0,2);
    }
    else{
      return [];
    }
  }

  const depList=(type)=>{
    if(type==="BTech" ){
      return Departments.slice(0,10);
    }else if(type==='MTech'){
      return Departments.slice(10,12);
    }
    else if(type==='MBA'){
      return Departments.slice(12,15);
    }
    else{
      return [];
    }
  }

 
  async function enrollStudent(){
    setIsLoading(true);
    const res = await enrollCourse(
      currentUser.email,{
        course:course.value,
        year:Year.value,
        department:Department.value,
        section:Section.value,
        subjects:subjects,
        isEnrolled:true,
        oe:oe,
        pe:pe 
      });
      if(res==null){
        setIsLoading(false);
        setShowDialog("Course Enrolled Successfully");
      }else{
        setShowDialog(res);
      }
        
  }

  return(
    <div className="enroll-container">
      <Navbar back={false} title="Enrollment" logout={false} />
      {
        showDialog && <Dialog message={showDialog} onOK={()=>{nav('/student/subjectslist',{replace:true})}}/>
      }       
      <div className="enroll-dropdown">
        <ul>
          <li>Update the details in the form to enroll into classes</li>
          <li>Once you submit the details you cannot change</li>
        </ul>
        
        <p className="enroll-dropdown-title">Course</p>
        <Select
          placeholder=""
          value={course}
          className="select"
          isDisabled={courseFlag}
          options={courses}
          onChange={(selectedCourse) => {
            setYear("");
            setSection('');
            setDepartment("");
            setCourse(selectedCourse);
          }}
        />

        <p className="enroll-dropdown-title">Year</p>
        <Select
          placeholder=""
          value={Year}
          className="enroll-select"
          options={yearsList(course.value)}
          isDisabled={!course || courseFlag}
          onChange={(selectedYear) => {
            setYear(selectedYear);
          }}
        />

        <p className="enroll-dropdown-title">Department</p>
        <Select
          placeholder=""
          value={Department}
          className="enroll-select"
          options={depList(course.value)}
          isDisabled={!Year || courseFlag}
          onChange={(selectedDepartment) => {
            setSection("");
            setDepartment(selectedDepartment);
          }}
        />

        <p className="enroll-dropdown-title">Section</p>
        <Select
          placeholder=""
          value={Section}
          options={Sections}
          className="enroll-select"
          isDisabled={!Department || courseFlag}
          onChange={(selectedSection) => {
            setSection(selectedSection);
            setButton(false);
          }}
        />

     
        {
          (openElectives!==null && professionalElectives!==null)?
          
          <div className="electives">

            <p className="enroll-dropdown-title">Open Elective</p>
            <Select
            placeholder=""
            value={{value:oe.subject,label:oe.subject}}
            options={
              openElectives.map(
                function(a) {
                  return  {value:a.subject, label:a.subject} 
                })
            }
            className="enroll-select"
            onChange={
              (selectedElective) => {
                openElectives.forEach(element =>{
                  if(element.subject===selectedElective.value){
                    setOe(element);
                  }
                });
              }
            }
            />


            <p className="enroll-dropdown-title">Professional Elective</p>
            <Select
            placeholder=""
            value={{value:pe.subject,label:pe.subject}}
            options={
              professionalElectives.map(
                function(a) {
                  return  {value:a.subject, label:a.subject} 
                })
            }
            className="enroll-select"
            onChange={
              (selectedElective) => {
                professionalElectives.forEach(element =>{
                  if(element.subject===selectedElective.value){
                    setPe(element);
                  }
                });
              }
            }
            />
            {
              !isLoading?
              <Button
                onClick={enrollStudent}
                className="enroll-button normal"
                disabled={button}
                width="30"
                height="40"
                children="Enroll"
              />:
              <div style={{marginTop:'20px'}}>
                <Spinner radius={2}/>
              </div>
            }
          </div>
          :
          (
            !isLoading?
            <Button
              onClick={getSubjects}
              className="enroll-button normal"
              disabled={button}
              width="30"
              height="40"
              children="Enroll"
            />:
            <div style={{marginTop:'20px'}}>
              <Spinner radius={2}/>
            </div>
          )
        }  
       </div>    
    </div>
  )
}
