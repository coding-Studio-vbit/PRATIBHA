import React, { useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./coeSearch.css";

export default function CoeSearch() {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
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
    { value: "A", label: "A", link: "CSE" },
    { value: "B", label: "B", link: "CSE" },
    { value: "C", label: "C", link: "CSE" },
    { value: "D", label: "D", link: "CSE" },
    { value: "A", label: "A", link: "ECE" },
    { value: "B", label: "B", link: "ECE" },
    { value: "A", label: "A", link: "EEE" },
    { value: "A", label: "A", link: "IT" },
    { value: "B", label: "B", link: "IT" },
  ];
  const Subjects = [
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
      <Navbar title="View Grades and Submission" />

      <div className="dropdown">
        <p>COURSE</p>
        <Select className="year" options={Courses} />
        <p>YEAR</p>
        <Select className="year" options={Years} />
        <p> DEPARTMENT</p>
        <Select options={Departments} />
        <p>SECTION</p>
        <Select options={Sections} />
        <p>SUBJECT</p>
        <Select options={Subjects} />
      </div>
      <Button
        className="done-button normal"
        icon={<i class="fas fa-search"></i>}
        children="View"
      />
    </div>
  );
}
