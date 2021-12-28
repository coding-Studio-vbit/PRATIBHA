import React, { useState,useEffect } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import { getDepartments } from "../services/facultyServices";
import { useNavigate } from "react-router-dom";
import Dialog from "../../global_ui/dialog/dialog";
import "./coeSearch.css";

export default function CoeSearch() {
  const [Course, setCourse] = useState({value:'none'});
  const [Year, setYear] = useState({value:0});
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
  const [subjects,setSubjects] = useState([
    
    { value: "loading", label: "Loading..." },
  ]);
  const [departments,setDepartments] = useState([
    
    { value: "loading", label: "Loading..." },
  ]);
  const [sections,setSections] = useState([
    
    { value: "loading", label: "Loading..." },
  ]);

  const [showDialog, setShowDialog] = useState(null);

  const nav = useNavigate();
  useEffect(()=>{
    const getLables = async ()=>{
      const res = await getDepartments(Course.value,Year.value)
      if(!res) return
       setSubjects(res.subjects)
       setDepartments(res.departments)
       setSections(res.sections)
    }
    getLables()
  },[Course,Year])


  function handleView() {
    if (
      Course.value != null &&
      Year.value != null &&
      Department.value != null &&
      Section.value != null &&
      Subject.value != null
    ) {
      var passing = {
        Course: Course.value,
        Year: Year.value,
        Dept: Department.value,
        Section: Section.value,
        Subject: Subject.value,
      };
      nav("/viewsubmissions", { state: passing });
    } else {
      setShowDialog("Select all the options");
    }
  }
  const Courses = [
    { value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [
    //fetch
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const MYears = [
    //fetch from db for the selected course
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];


  return (
    <div className="CoESearch-container">
      <Navbar title="CoE" back={false} />
      {showDialog && (
        <Dialog
          message={showDialog}
          onOK={() => {
            setShowDialog(false);
          }}
        />
      )}
      <div className="coe-dropdown">
        <p className="dropdown-title">Course</p>
        <Select
          placeholder=""
          className="select"
          options={Courses}
          onChange={(selectedCourse) => {
            setCourse(selectedCourse);
          }}
        />
        <p className="dropdown-title">Year</p>
        <Select
              placeholder=""
              className="select"
              options={Course.value[0]==='M'? MYears:Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
        <p className="dropdown-title">Department</p>
        <Select
              placeholder=""
              options={departments}
              className="select"
              isDisabled={!Year}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
                setSections((c)=>{return {...c}})
              }}
            />
        <p className="dropdown-title">Section</p>
        <Select
              placeholder=""
              options={sections[Department.value]}
              className="select"
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection);
              }}
            />
        <p className="dropdown-title">Subject</p>
        <Select
              placeholder=""
              options={subjects[Department.value]}
              className="select"
              isDisabled={!Section}
              onChange={(selectedSubject) => {
                setSubject(selectedSubject);
              }}
            />
        <Button
          className="coe-button normal"
          icon={<i className="fas fa-search"></i>}
          children="View"
          width="90"
          height="40"
          onClick={handleView}
        />
      </div>
    </div>
  );
}
