import React, { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import Button from "../../../global_ui/buttons/button";
import Navbar from "../../../global_ui/navbar/navbar";
import "./lockList.css";
import { useNavigate } from "react-router-dom";


const LockList = () => {
  const nav = useNavigate()
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);

  const [BTechList, setBTechList] = useState([]);
  const [MTechList, setMTechList] = useState([]);
  const [MBAList, setMBAList] = useState([]);

  useEffect(()=>{
    console.log(BTechList);
  },[BTechList])
  function handleDone() {
    
    nav('/faculty/subjectsList');
    //store this list of mtech btech and mba for this respective faculty and then show "../../generalFaculty/ClassList/classList" screen for that faculty
    
  }
  //handleAddButton displays their selected course in groups of mtech btech and mba , repititions are handled
  const handleAddButton = () => {
    if (Course === "B.Tech") {
      const newBTech =
        Year +
        "_" +
        Department +
        "_" +
        Section +
        "_" +
        Subject;
        console.log("hvkgh");
      if (!BTechList.includes(newBTech)) setBTechList([...BTechList, newBTech]);
    } else if (Course === "M.Tech") {
      const newMTech =
        Year +
        "_" +
        Department +
        "_" +
        Section +
        "_" +
        Subject;
      if (!MTechList.includes(newMTech)) setMTechList([...MTechList, newMTech]);
    } else if (Course === "MBA") {
      const newMBA =
        Year +
        "_" +
        Department +
        "_" +
        Section +
        "_" +
        Subject;
      if (!MBAList.includes(newMBA)) setMBAList([...MBAList, newMBA]);
    }
    console.log({
      course :Course,
      year: Year,
      department: Department,
      section: Section,
      subject: Subject,
    });
    console.log(BTechList);
  };

  //handle remove
  const handleRemove = (index, array, func) => {
    var temp = [...array];
    temp.splice(index, 1);
    func(temp);
  };

  const Courses = [
    { value: "B.Tech", label: "B.Tech" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [
    //fetch from db for the selected course
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const Departments = [
    //fetch from db for the selected course
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
    //fetch from db for the selected department
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];
  const Subjects = [
    //fetch from db for the combination of the above 4 dropdowns
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
        <Navbar title="Classes List" logout={false} />
        <p>{JSON.stringify(BTechList)}</p>
        <p className="instruction">*Add your classes for this semester</p>
        <div className="flex-container">
          <div className="dropdown">
            <p>COURSE</p>
            <Select
              placeholder=""
              className="select"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse.value);
              }}
            />
            <p>YEAR</p>
            <Select
              placeholder=""
              className="select"
              options={Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear.value);
              }}
            />
            <p>DEPARTMENT</p>
            <Select
              placeholder=""
              options={Departments}
              className="select"
              isDisabled={!Year}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment.value);
              }}
            />
            <p>SECTION</p>
            <Select
              placeholder=""
              options={Sections}
              className="select"
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection.value);
              }}
            />
            <p>SUBJECT</p>
            <Select
              placeholder=""
              options={Subjects}
              className="select"
              isDisabled={!Section}
              onChange={(selectedSubject) => {
                setSubject(selectedSubject.value);
              }}
            />
            <button
              className="add-button"
              width="100"
              height="50"
              disabled={!Subject}
              onClick={handleAddButton}
            >
              <i className="fas fa-plus"></i>ADD
            </button>
          </div>
          <div>
            <div className="list-container">

              {BTechList.length !== 0 && (
                <div>
                  <h4> B.Tech </h4>
                  <ul>
                    {BTechList.map((item, index) => {
                      return (
                        <li className="li-tag-flex" key={index}>
                          {item}

                          <span className="far">
                            <i
                              onClick={() => {
                                handleRemove(index, BTechList, setBTechList);
                              }}
                              className="lock-screen-icon fas fa-minus"
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {MTechList.length !== 0 && (
                <div>
                  <h4> M.Tech </h4>
                  <ul>
                    {MTechList.map((item, index) => {
                      return (
                        <li className="li-tag-flex" key={index}>
                          {item}
                          <span className="far">
                            <i
                              onClick={() => {
                                handleRemove(index, MTechList, setMTechList);
                              }}
                              className=" lock-screen-icon fas fa-minus"
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {MBAList.length !== 0 && (
                <div>
                  <h4> MBA </h4>
                  <ul>
                    {MBAList.map((item, index) => {
                      return (
                        <li className="li-tag-flex" key={index}>
                          {item}
                          <span className="far">
                            <i
                              onClick={() => {
                                handleRemove(index, MBAList, setMBAList);
                              }}
                              className="lock-screen-icon fas fa-minus"
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <Button
              className="locklist-button normal"
              width="90"
              height="40"
              children="Done"
              onClick={handleDone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockList;

//this screen is common for HOD and general faculty roles
