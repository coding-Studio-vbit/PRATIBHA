import React, { useEffect, useState } from "react";
import Select from "react-select";
import Button from "../../../global_ui/buttons/button";
import Navbar from "../../../global_ui/navbar/navbar";
import Dialog from "../../../global_ui/dialog/dialog";
import { LoadingScreen } from "../../../global_ui/spinner/spinner";
import {
  enrollClasses,
  enrollHODClasses,
  getDepartments,
} from "../../services/facultyServices";
import "./lockList.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LockList = () => {
  const [Course, setCourse] = useState({ value: "none" });
  const [Year, setYear] = useState({ value: 0 });
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");

  const [BTechList, setBTechList] = useState([]);
  const [MTechList, setMTechList] = useState([]);
  const [MBAList, setMBAList] = useState([]);

  const [disabledep, setdisabledep] = useState(true);
  const [disablesec, setdisablesec] = useState(true);
  const [disablesub, setdisablesub] = useState(true);

  const [showDialog, setShowDialog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [subjects, setSubjects] = useState([
    { value: "loading", label: "Loading..." },
  ]);
  const [departments, setDepartments] = useState([
    { value: "loading", label: "Loading..." },
  ]);
  const [sections, setSections] = useState([
    { value: "loading", label: "Loading..." },
  ]);


  const { currentUser } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    const getLables = async () => {
      try{
        const res = await getDepartments(Course.value, Year.value);
        if (!res) return;
        setSubjects(res.subjects);
        setDepartments(res.departments);
        setSections(res.sections);
      }
      catch(error){
        console.log(error)
      }
    };
    getLables();
  }, [Course, Year]);

  function handleDone() {
    //store this list of mtech btech and mba for this respective faculty and then show classlist screen for that faculty
    var finalList = BTechList.concat(MTechList, MBAList);
    if (finalList.length === 0) {
      setShowDialog("Add your classes for this semester");
    } else {
      try{

        enroll(finalList);
      }
      catch(e){
        console.log(e)

      }
    }
  }
  //handleAddButton displays their selected course in groups of mtech btech and mba , repititions are handled
  const handleAddButton = () => {
    if (Course.value === "BTech") {
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
    } else if (Course.value === "MTech") {
      const newMTech =
        "MTech_" +
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
        "MBA_" +
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
    setDepartments([{ value: "Loading", label: "Loading" }]);
    setSections([{ value: "Loading", label: "Loading" }]);
    setSubjects([{ value: "Loading", label: "Loading" }]);
    setdisabledep(true);
    setdisablesec(true);
    setdisablesub(true);
  };

  //handle remove
  const handleRemove = (index, array, func) => {
    var temp = [...array];
    temp.splice(index, 1);
    func(temp);
  };

  const Courses = [
    { value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
    { value: "MBA", label: "MBA" },
  ];
  const Years = [
    //fetch from db for the selected course
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

  async function enroll(list) {
    if (currentUser.isHOD) {
      setIsLoading(true);
      try{
        const res = await enrollHODClasses(currentUser.email, list);
        if (res == null) {
          setIsLoading(false);
          setShowDialog("Course Enrolled Successfully");
          setIsSuccess(true);
        } else {
          setShowDialog(res);
        }
      }
      catch(e){
        console.log(e)
      }
    } else {
      setIsLoading(true);
      try{

        const res = await enrollClasses(currentUser.email, list);
        if (res == null) {
          setIsLoading(false);
          setShowDialog("Classes Enrolled Successfully");
          setIsSuccess(true);
        } else {
          setShowDialog(res);
        }
      }
      catch(e){
        console.log(e)
      }
    }
  }

  return (
    <div>
      {currentUser.isFirstTime ? (
        <div className="lockList-container">
          <Navbar title="Classes List" back={false} logout={false} />
          <p className="instruction">*Add your classes for this semester</p>
          {showDialog && (
            <Dialog
              message={showDialog}
              onOK={() => {
                isSuccess
                  ? currentUser.isHOD
                    ? nav(
                        "/faculty/hodclasslist",
                        { state: currentUser },
                        { replace: true }
                      )
                    : nav(
                        "/faculty/classlist",
                        { state: currentUser },
                        { replace: true }
                      )
                  : setShowDialog(false);
              }}
            />
          )}
          {isLoading && <LoadingScreen />}
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
                options={Course.value[0] === "M" ? MYears : Years}
                isDisabled={!Course}
                onChange={(selectedYear) => {
                  setYear(selectedYear);
                  setdisabledep(false);
                }}
              />
              <p className="locklist-dropdown-title">Department</p>
              <Select
                placeholder=""
                options={departments}
                className="select"
                isDisabled={disabledep}
                onChange={(selectedDepartment) => {
                  setDepartment(selectedDepartment);
                  setdisablesec(false);
                  setSections((c) => {
                    return { ...c };
                  });
                }}
              />
              <p className="locklist-dropdown-title">Section</p>
              <Select
                placeholder=""
                options={sections[Department.value]}
                className="select"
                isDisabled={disablesec}
                onChange={(selectedSection) => {
                  setSection(selectedSection);
                  setdisablesub(false);
                }}
              />
              <p className="locklist-dropdown-title">Subject</p>
              <Select
                placeholder=""
                options={subjects[Department.value]}
                className="select"
                isDisabled={disablesub}
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
                        var displayItem = item.split("_");
                        displayItem.splice(0, 1);
                        let newItem = displayItem[0];
                        let len = displayItem.length;
                        for (let i = 1; i < len; i++) {
                          newItem = newItem + "_" + displayItem[i];
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
                        var displayItem = item.split("_");
                        displayItem.splice(0, 1);
                        let newItem = displayItem[0];
                        let len = displayItem.length;
                        for (let i = 1; i < len; i++) {
                          newItem = newItem + "_" + displayItem[i];
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
                      {MBAList.map((item, index) => {
                        var displayItem = item.split("_");
                        displayItem.splice(0, 1);
                        let newItem = displayItem[0];
                        let len = displayItem.length;
                        if (displayItem[0] === "1")
                          newItem =
                            newItem +
                            "_" +
                            displayItem[2] +
                            "_" +
                            displayItem[3];
                        else {
                          for (let i = 1; i < len; i++) {
                            newItem = newItem + "_" + displayItem[i];
                          }
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
      ) : (
        <Dialog
          message="Already Enrolled. Contact admin for making changes"
          onOK={() => {
            nav(
              "/faculty/classlist",
              { state: currentUser },
              { replace: true }
            );
          }}
        />
      )}
    </div>
  );
};

export default LockList;

//this screen is common for HOD and general faculty roles
