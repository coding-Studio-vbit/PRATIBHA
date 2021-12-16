import React, {  useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./enroll.css";


export default function StudentEnroll() {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const[button,setButton]=useState(true);

  const Courses = [
    { value: "B.Tech", label: "B.Tech" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const Departments = [
    { value: "CSE", label: "Computer Science & Engineering" },
    {
      value: "CSM",
      label: "CSE(Artificial Intelligence & Machine Learning)",
    },
    { value: "CSD", label: "CSE(Data Science)" },
    { value: "CS", label: "CSE(Cyber Security)" },
    { value: "CSB", label: "Computer Science & Business System" },
    { value: "ECE", label: "Electronics & Communications Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "IT", label: "Information Technology" },
  ];
  const Sections = [
    { value: "A", label: "A", link: "CSE" },
    { value: "B", label: "B", link: "CSE" },
    { value: "C", label: "C", link: "CSE" },
    { value: "D", label: "D", link: "CSE" },
  
  ];

 
  


 
    return (
      <div className="enroll-container">
        <Navbar title="Enrollment Screen" logout={false} />

        <div className="dropdown">
            <p className="dropdown-title">Course</p>
            <Select
              placeholder=""
              className="course"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
              }}
            />
            <p className="dropdown-title">Year</p>
            <Select
              placeholder=""
              className="year"
              options={Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
            <p className="dropdown-title">Department</p>
            <Select
              placeholder=""
              options={Departments}
              isDisabled={!Year}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
              }}
            />
            <p className="dropdown-title">Section</p>
            <Select
              placeholder=""
              options={Sections}
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection);
                setButton(false);
              }}
            />
           
           
          </div>

        <Button onClick={()=>{console.log(Course.value+'_'+ Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value 
        )}}  className="button normal" disabled={button} width="150" height="50" children="Enroll"/>
      </div>
    );
  }



