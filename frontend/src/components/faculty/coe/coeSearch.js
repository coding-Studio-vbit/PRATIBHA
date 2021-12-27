import React, { useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import { useNavigate } from "react-router-dom";
import Dialog from "../../global_ui/dialog/dialog";
import "./coeSearch.css";

export default function CoeSearch() {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");

  const [showDialog, setShowDialog] = useState(null);

  const nav = useNavigate();

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
    { value: "B.Tech", label: "B.Tech" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [
    //fetch
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const Departments = [
    //fetch
    { value: "CSE", label: "Computer Science & Engineering" },
    {
      value: "CSEAIML",
      label: "CSE(Artificial Intelligence & Machine Learning)",
    },
    { value: "CSEDS", label: "CSE(Data Science)" },
    { value: "CSECS", label: "CSE(Cyber Security)" },
    { value: "CSBS", label: "Computer Science & Business System" },
    { value: "ECE", label: "Electronics & Communications Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "IT", label: "Information Technology" },
  ];
  const Sections = [
    //fetch
    { value: "A", label: "A", link: "CSE" },
    { value: "B", label: "B", link: "CSE" },
    { value: "C", label: "C", link: "CSE" },
    { value: "D", label: "D", link: "CSE" },
  ];
  const Subjects = [
    //fetch
    { value: "PPS", label: "PPS", link: "CSE" },
    {
      value: "Software Engineering",
      label: "Software Engineering",
      link: "CSE",
    },
    { value: "Compiler Design", label: "Compiler Design", link: "CSE" },
    {
      value: "Engineering Mechanics",
      label: "Engineering Mechanics",
      link: "CE",
    },
  ];

  return (
    <div className="CoESearch-container">
      <Navbar title="CoE" />
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
          className="select"
          placeholder=""
          options={Years}
          isDisabled={!Course}
          onChange={(selectedYear) => {
            setYear(selectedYear);
          }}
        />
        <p className="dropdown-title">Department</p>
        <Select
          className="select"
          placeholder=""
          options={Departments}
          isDisabled={!Year}
          onChange={(selectedDepartment) => {
            setDepartment(selectedDepartment);
          }}
        />
        <p className="dropdown-title">Section</p>
        <Select
          className="select"
          placeholder=""
          options={Sections}
          isDisabled={!Department}
          onChange={(selectedSection) => {
            setSection(selectedSection);
          }}
        />
        <p className="dropdown-title">Subject</p>
        <Select
          placeholder=""
          options={Subjects}
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
