import React, { useEffect, useState } from "react";
import Select from "react-select";
import Navbar from "../../../global_ui/navbar/navbar";
import Dialog from "../../../global_ui/dialog/dialog";
import { LoadingScreen } from "../../../global_ui/spinner/spinner";
import { addClass, getDepartments } from "../../services/facultyServices";
import "./addclasses.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchRegulationOptions,fetchSemNumber } from "../../../student/services/studentServices";

export default function AddClasses() {
  const [Course, setCourse] = useState({ value: "none" });
  const [Year, setYear] = useState({ value: 0 });
  const [Department, setDepartment] = useState("");
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");

  const [disabledep, setdisabledep] = useState(true);
  const [disablesec, setdisablesec] = useState(true);
  const [disablesub, setdisablesub] = useState(true);
  const [disableadd, setdisableadd] = useState(true);
  const [disablereg, setdisablereg] = useState(true);

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

  const [Regulation, setRegulation] = useState("");

  const [regoptionss, setregoptionss] = useState([]);
  async function regoptions() {
    const res = await fetchRegulationOptions();
    setregoptionss(res.data);
  }

  const { currentUser } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    const getLables = async () => {
      try {
        const sem = await fetchSemNumber(Course.value,Year.value);
        const res = await getDepartments(Course.value,Year.value,sem);
        if (!res) return;
        setSubjects(res.subjects);
        setDepartments(res.departments);
        setSections(res.sections);
      } catch (error) {
        console.log(error);
      }
    };
    getLables();
  }, [Course, Year]);

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

  function addFailed(){
  
    setdisabledep(true);
    setdisablesec(true);
    setdisablesub(true);
    setdisableadd(true);
    setdisablereg(true);
    setShowDialog(false);
  }

  async function handleAddButton() {
    const adding =
      Course.value +
      "_"+
      Regulation.value+
      "_" +
      Year.value +
      "_" +
      Department.value +
      "_" +
      Section.value +
      "_" +
      Subject.value;
    try {
      setdisableadd(true);
      setIsLoading(true);

      const res = await addClass(currentUser.email, adding);

      if (res === null) {

        setIsLoading(false);
        setIsSuccess(true);
        setShowDialog("Class added");
      } else if(res.data!=null) {
        setIsLoading(false);
        setShowDialog(
          res.className+" is already enrolled by "+ res.data
        );
      }
      else{
        setIsLoading(false);
        setShowDialog(res);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar
        title={"Add any class"}
        backURL={
          "/faculty/classlist"
        }
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="addclasses-root">
          <p className="addclasses-instruction">Select the class to be added.</p>
          {showDialog && (
            <Dialog
              message={showDialog}
              onOK={() => {
                isSuccess
                  ?  nav(
                        "/faculty/classlist",
                        { state: currentUser },
                        { replace: true }
                      )
                  : (addFailed() )
              }}
            />
          )}
          <div className="addclasses-dropdown">
            <p className="addclasses-dropdown-title">Course</p>
            <Select
              placeholder=""
              className="select-addclasses"
              options={Courses}
              onChange={(selectedCourse) => {
                setCourse(selectedCourse);
                regoptions();
              }}
            />
            <p className="addclasses-dropdown-title">Year</p>
            <Select
              placeholder=""
              className="select-addclasses"
              options={Course.value[0] === "M" ? MYears : Years}
              isDisabled={!Course}
              onChange={(selectedYear) => {
                setYear(selectedYear);
                setdisabledep(false);
                setdisablereg(false);
              }}
            />
            <p className="addclasses-dropdown-title">Regulation</p>
            <Select
              placeholder=""
              isDisabled={disablereg}
              className="select-addclasses"
              options={regoptionss}
              onChange={(r) => {
                setdisabledep(false);

                setRegulation(r);
              }}
            />
            <p className="addclasses-dropdown-title">Department</p>
            <Select
              placeholder=""
              options={departments}
              className="select-addclasses"
              isDisabled={disabledep}
              onChange={(selectedDepartment) => {
                setDepartment(selectedDepartment);
                setdisablesec(false);
                setSections((c) => {
                  return { ...c };
                });
              }}
            />
            <p className="addclasses-dropdown-title">Section</p>
            <Select
              placeholder=""
              options={sections[Department.value]}
              className="select-addclasses"
              isDisabled={disablesec}
              onChange={(selectedSection) => {
                setSection(selectedSection);
                setdisablesub(false);
              }}
            />
            <p className="addclasses-dropdown-title">Subject</p>

            <Select
              placeholder=""
              options={subjects[Department.value]}
              className="select-addclasses"
              isDisabled={disablesub}
              onChange={(selectedSubject) => {
                setSubject(selectedSubject);
                setdisableadd(false);
              }}
            />
            <div className="addclasses-btn-div">
              <button
                className=" addclasses-btn normal"
                width="100"
                height="50"
                disabled={disableadd}
                onClick={handleAddButton}
              >
                <i className="fas fa-plus"></i>ADD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
