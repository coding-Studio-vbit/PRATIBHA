import React, { useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./enroll.css";

export default function StudentEnroll() {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [button, setButton] = useState(true);

  function handleEnroll(){
    //store this students class in db
    console.log(Course.value+'_'+Year.value+'_'+Department.value+'_'+Section.value)
  }

  const Courses = [
    { value: "B.Tech", label: "B.Tech" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [{ value: "1", label: "1" }];

  const Departments = [
    //fetch from db
    { value: "CSE", label: "Computer Science & Engineering" },
    {
      value: "CSM",
      label: "CSE(Artificial Intelligence & Machine Learning)",
    },
    { value: "CSD", label: "CSE(Data Science)" },
    { value: "CSC", label: "CSE(Cyber Security)" },
    { value: "CSB", label: "Computer Science & Business System" },
    { value: "ECE", label: "Electronics & Communications Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "IT", label: "Information Technology" },
  ];
  const Sections = [
    //fetch from db
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  return (
    <div className="enroll-container">
      <Navbar title="Enrollment" logout={false} />

      <div className="dropdown">
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
          options={Years}
          isDisabled={!Course}
          onChange={(selectedYear) => {
            setYear(selectedYear);
          }}
        />
        <p className="dropdown-title">Department</p>
        <Select
          placeholder=""
          className="select"
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
          className="select"
          isDisabled={!Department}
          onChange={(selectedSection) => {
            setSection(selectedSection);
            setButton(false);
          }}
        />
      </div>

      <Button
        onClick={handleEnroll}
        className="button normal"
        disabled={button}
        width="90"
        height="40"
        children="Enroll"
      />
    </div>
  );
}
