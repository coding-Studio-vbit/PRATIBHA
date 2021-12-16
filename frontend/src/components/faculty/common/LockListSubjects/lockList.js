import React, { useState } from "react";
import Select from "react-select";
import Button from "../../../global_ui/buttons/button";
import Navbar from "../../../global_ui/navbar/navbar";
import "./lockList.css";

const LockList = () => {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
  const [BTechList, setBTechList] = useState([]);
  const [MTechList, setMTechList] = useState([]);
  const [MBAList, setMBAList] = useState([]);
  const handleAddButton = () => {
    if (Course.value === "B.Tech") {
      const newBTech =
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!BTechList.includes(newBTech)) setBTechList([...BTechList, newBTech]);
    } else if (Course.value === "M.Tech") {
      const newMTech =
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!MTechList.includes(newMTech)) setMTechList([...MTechList, newMTech]);
    } else if (Course.value === "MBA") {
      const newMBA =
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!MBAList.includes(newMBA)) setMBAList([...MBAList, newMBA]);
    }
  };
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

  return (
    <div>
      <div className="lockList-container">
        <Navbar title="Class List" logout={false} />
        <p className="instruction">*Add your classes for this semester</p>
        <div className="flex-container">
          <div className="dropdown">
            <p>COURSE</p>
            <Select
              placeholder=""
              className="course"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
              }}
            />
            <p>YEAR</p>
            <Select
              placeholder=""
              className="year"
              options={Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
            <p>DEPARTMENT</p>
            <Select
              placeholder=""
              options={Departments}
              isDisabled={!Year}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
              }}
            />
            <p>SECTION</p>
            <Select
              placeholder=""
              options={Sections}
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection);
              }}
            />
            <p>SUBJECT</p>
            <Select
              placeholder=""
              options={Subjects}
              isDisabled={!Section}
              onChange={(selectedSubject) => {
                setSubject(selectedSubject);
              }}
            />
            <button
              className="add-button"
              width="100"
              height="50"
              disabled={!Subject}
              onClick={handleAddButton}
            >
              {" "}
              <i className="fas fa-plus"></i>ADD
            </button>
          </div>

          <div className="list-container">
            {BTechList.length !== 0 && (
              <div>
                <h4> B.Tech </h4>
                <ul>
                  {BTechList.map((item, index) => {
                    return <li>{item}</li>;
                  })}
                </ul>
              </div>
            )}
            {MTechList.length !== 0 && (
              <div>
                <h4> M.Tech </h4>
                <ul>
                  {MTechList.map((item, index) => {
                    return <li>{item}</li>;
                  })}
                </ul>
              </div>
            )}
            {MBAList.length !== 0 && (
              <div>
                <h4> MBA </h4>
                <ul>
                  {MBAList.map((item, index) => {
                    return <li>{item}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Button
          className="done-button normal"
          width="100"
          height="50"
          children="Done"
        />
      </div>
    </div>
  );
};

export default LockList;

//this screen is common for HOD and general faculty roles
