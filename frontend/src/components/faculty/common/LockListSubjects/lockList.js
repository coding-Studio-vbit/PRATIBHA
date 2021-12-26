import React, { useState } from "react";
import Select from "react-select";
import Button from "../../../global_ui/buttons/button";
import Navbar from "../../../global_ui/navbar/navbar";
import Dialog from "../../../global_ui/dialog/dialog";
import { LoadingScreen } from "../../../global_ui/spinner/spinner";
import { enrollClasses } from "../../services/facultyServices";
import "./lockList.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LockList = () => {
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
  const [BTechList, setBTechList] = useState([]);
  const [MTechList, setMTechList] = useState([]);
  const [MBAList, setMBAList] = useState([]);

  const [showDialog, setShowDialog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess,setIsSuccess]=useState(false);

  const { currentUser } = useAuth();
  const nav = useNavigate();

  function handleDone() {
    
    nav('/faculty/subjectslist');
    //store this list of mtech btech and mba for this respective faculty and then show "../../generalFaculty/ClassList/classList" screen for that faculty
    var finalList = BTechList.concat(MTechList, MBAList);
    console.log(finalList);
    if (finalList.length == 0) {
      setShowDialog("Add your classes for this semester");
    }
    else{enroll(finalList)}
  }
  //handleAddButton displays their selected course in groups of mtech btech and mba , repititions are handled
  const handleAddButton = () => {
    if (Course.value === "B.Tech") {
      const newBTech =
        "BTech_" +
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!BTechList.includes(newBTech)) setBTechList([...BTechList, newBTech]);
      else {
        setShowDialog("Class already added");
      }
    } else if (Course.value === "M.Tech") {
      const newMTech =
      'MTech_'+
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!MTechList.includes(newMTech)) setMTechList([...MTechList, newMTech]);
      else {
        setShowDialog("Class already added");
      }
    } else if (Course.value === "MBA") {
      const newMBA =
      'MBA_'+
        Year.value +
        "_" +
        Department.value +
        "_" +
        Section.value +
        "_" +
        Subject.value;
      if (!MBAList.includes(newMBA)) setMBAList([...MBAList, newMBA]);
      else {
        setShowDialog("Class already added");
      }
    }
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

  async function enroll(list) {
    setIsLoading(true);
    const res = await enrollClasses(currentUser.email,list);
    if (res == null) {
      setIsLoading(false);
      setShowDialog("Course Enrolled Successfully");
      setIsSuccess(true);
    } else {
      setShowDialog(res);
    }
  }

  return (
    <div>
      <div className="lockList-container">
        <Navbar title="Classes List" back={false} logout={false} />
        <p className="instruction">*Add your classes for this semester</p>
        {showDialog && (
          <Dialog
            message={showDialog}
            onOK={() => {
              isSuccess ? (nav('/faculty/classlist',{state:currentUser},{replace:true})):(setShowDialog(false))
            }}
          />
        )}
        {
          isLoading && (<LoadingScreen/>)
        }
        <div className="flex-container">
          <div className="dropdown">
            <p className="locklist-dropdown-title">Course</p>
            <Select
              placeholder=""
              className="select"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
              }}
            />
            <p className="locklist-dropdown-title">Year</p>
            <Select
              placeholder=""
              className="select"
              options={Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
              }}
            />
            <p className="locklist-dropdown-title">Department</p>
            <Select
              placeholder=""
              options={Departments}
              className="select"
              isDisabled={!Year}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
              }}
            />
            <p className="locklist-dropdown-title">Section</p>
            <Select
              placeholder=""
              options={Sections}
              className="select"
              isDisabled={!Department}
              onChange={(selectedSection) => {
                setSection(selectedSection);
              }}
            />
            <p className="locklist-dropdown-title">Subject</p>
            <Select
              placeholder=""
              options={Subjects}
              className="select"
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
                      var displayItem = item.split('_');
                      displayItem.splice(0,1)
                      let newItem =displayItem[0]
                      let len=displayItem.length
                      for (let i = 1;i<len;i++) {
      newItem = newItem+ '_'+displayItem[i]
     
   }
                      return (
                        <li className="li-tag-flex" key={index}>
                          {newItem}

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
                      var displayItem = item.split('_');
                      displayItem.splice(0,1)
                      let newItem =displayItem[0]
                      let len=displayItem.length
                      for (let i = 1;i<len;i++) {
      newItem = newItem+ '_'+displayItem[i]
     
   }
                      return (
                        <li className="li-tag-flex" key={index}>
                          {newItem}
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
                    {MBAList.map((item, index) => { var displayItem = item.split('_');
                      displayItem.splice(0,1)
                      let newItem =displayItem[0]
                      let len=displayItem.length
                      for (let i = 1;i<len;i++) {
      newItem = newItem+ '_'+displayItem[i]
     
   }
                      return (
                        <li className="li-tag-flex" key={index}>
                          {newItem}
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
