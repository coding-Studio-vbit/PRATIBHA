import React, { useEffect, useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./enroll.css";
import { useAuth } from "../../context/AuthContext";
import { enrollCourse } from "../services/studentServices";

export default function StudentEnroll() {
  const [course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [button, setButton] = useState(true);
  const { currentUser }= useAuth();

  async function handleEnroll(){
    if(course.value!=null &&  Year.value!=null && Department.value!=null && Section.value!=null){
      console.log("Entered");
        const res=await enrollCourse(currentUser.email,{
          course:course.value,
          year:Year.value,
          department:Department.value,
          section:Section.value,
          isEnrolled:true,
        })
        console.log(res);
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

  useEffect(() => {
      
  },)

  return (
    <div className="enroll-container">
      <Navbar back={false} title="Enrollment" logout={false} />
        
      <div className="enroll-dropdown">
        
        <p className="enroll-dropdown-title">Course</p>
        <Select
          placeholder=""
          value={course}
          className="select"
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
          isDisabled={!course}
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
          isDisabled={!Year}
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
          isDisabled={!Department}
          onChange={(selectedSection) => {
            setSection(selectedSection);
            setButton(false);
          }}
        />

      </div>

      <Button
        onClick={handleEnroll}
        className="enroll-button normal"
        disabled={button}
        width="30"
        height="40"
        children="Enroll"
      />
    </div>
  );
}
