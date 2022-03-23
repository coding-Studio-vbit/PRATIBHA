import React, { useState,useEffect } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import { getDepartments } from "../services/facultyServices";
import { fetchRegulationOptions, fetchSemNumber } from "../../student/services/studentServices";
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
  const [Regulation,setRegulation]=useState('');
  const[regoptionss,setregoptionss]=useState([]);
   async function regoptions(){
    const res = await fetchRegulationOptions();
  setregoptionss(res.data);
   }

  const nav = useNavigate();
  useEffect(()=>{
    const getLables = async ()=>{
      const sem = await fetchSemNumber(Course.value,Year.value);
      const res = await getDepartments(Course.value,Year.value,sem);
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
      Regulation.value!=null&&
      Department.value != null &&
      Section.value != null &&
      Subject.value != null
    ) {
      var passing = {
        Course: Course.value,
        Year: Year.value,
        Regulation:Regulation.value,
        Dept: Department.value,
        Section: Section.value,
        Subject: Subject.value,
      };
      nav("/faculty/viewsubmissions", { state: passing });
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
    <div >
      <Navbar title="COE" back={false} logout />
      <div className="COESearch-container">
      {showDialog && (
        <Dialog
          message={showDialog}
          onOK={() => {
            setShowDialog(false);
          }}
        />
      )}
      <div className="btnflexcoe">

      <Button className="normal deadlinesbtn">Deadlines</Button>
      </div>
 
      <p className="coe-instruction">Select the class to view grades.</p>
     
      <div className="coe-dropdown">
        <p className="dropdown-title">Course</p>
        <Select
          placeholder=""
          className="selectCOE"
          options={Courses}
          onChange={(selectedCourse) => {
            setCourse(selectedCourse);
            regoptions();
          }}
        />
        <p className="dropdown-title">Year</p>
        <Select
              placeholder=""
              className="selectCOE"
              options={Course.value[0]==='M'? MYears:Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
             <p className="dropdown-title">Regulation</p>
                        <Select
                        placeholder=""
                        value={Regulation}
                        isDisabled={!Year}
                        className="selectCOE"
                        options={regoptionss}
                        onChange={(r) => {
                         
                           
                            setRegulation(r);
                        }}
                        />
        <p className="dropdown-title">Department</p>
        <Select
              placeholder=""
              options={departments}
              className="selectCOE"
              isDisabled={!Regulation}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
                setSections((c)=>{return {...c}})
              }}
            />
        <p className="dropdown-title">Section</p>
        <Select
              placeholder=""
              options={sections[Department.value]}
              className="selectCOE"
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection);
              }}
            />
        <p className="dropdown-title">Subject</p>
        <Select
              placeholder=""
              options={subjects[Department.value]}
              className="selectCOE"
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
    </div>
  );
}
