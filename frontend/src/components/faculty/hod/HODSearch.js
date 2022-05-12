import React, { useEffect, useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar.js";
import Button from "../../global_ui/buttons/button";
import "./HODSearch.css";
import { useAuth } from "../../context/AuthContext.js";
import {
  fetchRegulationOptions,
  fetchSemNumber,
} from "../../student/services/studentServices.js";
import {
  getFirstYearCurriculumData,
  getDepartments,
  getIsEnrolled,
  getFirstYearStatistics,
} from "../services/facultyServices.js";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../global_ui/spinner/spinner";

const HODSearch = () => {
  const {user}=useAuth();
  getFirstYearCurriculumData(1);
  getFirstYearStatistics();
  const [Course, setCourse] = useState({ value: "Loading", label: "Loading" });
  const [isEnrolled, setisEnrolled] = useState(false);
  const [Year, setYear] = useState("");
  const { currentUser } = useAuth();
  const [Section, setSection] = useState("");
  const [Subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [klass, setKlass] = useState([{ value: "Loading", label: "Loading" }]);
  const [disabledep, setdisabledep] = useState(true);
  const [disablesec, setdisablesec] = useState(true);
  const [dep, setDep] = useState("");
  const [notCreatedClasses,setnotCreatedClasses ]=useState(null);
  const [department, setDepartment] = useState([
    { value: "Loading", label: "Loading" },
  ]);
  const [subjects, setSubjects] = useState([
    { value: "Loading", label: "Loading" },
  ]);
  const [sections, setsections] = useState([
    { value: "Loading", label: "Loading" },
  ]);
  const [showdep, setshowdep] = useState([]);

  async function findIsEnrolled() {
    const res = await getIsEnrolled(currentUser.email);

    setisEnrolled(res.data);
  }
  useEffect(() => {
    let klasses = [];
    let departments = [];
    for (let i = 0; i < currentUser.roles.length; i++) {
      const parts = currentUser.roles[i].split("_");
      klasses.push({ value: parts[0], label: parts[0] });
      departments.push({ value: parts[0], label: parts[1] });
    }
    setLoading(false);
    setKlass(klasses);
    setDepartment(departments);
    findIsEnrolled();
  }, []);
  function filterDep(course) {
    if (course.value !== "MBA" && !currentUser.isFirstYearHOD) {
      let showdeps = [];

      for (let j = 0; j < department.length; j++) {
        if (department[j].value === course.value) {
          showdeps.push(department[j]);
        }
      }
      setshowdep(showdeps);
    }
  }

  useEffect(() => {
    const getLables = async () => {
      try {
        const sem = await fetchSemNumber(Course.value, Year.value);
        const res = await getDepartments(Course.value, Year.value, sem);
        if (!res) return;
        setSubjects(res.subjects);
        setsections(res.sections);
        if (Course.value === "MBA") {
          if (Year.value === "1") {
            setdisabledep(true);
            setDep({
              value: "MBA",
              label: "Not Applicable",
            });
            setdisablesec(false);
          }
          if (Year.value === "2") {
            setdisabledep(false);
            setshowdep(res.departments);
          }
        } else if (currentUser.isFirstYearHOD) {
          setshowdep(res.departments);
          setdisabledep(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLables();
  }, [Course, Year]);

  const [button, setButton] = useState(true);

  const Years = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const MYears = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];

  function handleClick() {
    nav("/faculty/viewsubmissions", {
      state: {
        Course: Course.value,
        Year: Year.value,
        Regulation: Regulation.value,
        Dept: dep.label,
        Section: Section.value,
        Subject: Subject.value,
      },
    });
  }

 async function report(){
   if (user.isFirstYearHOD){
     const res = await getFirstYearStatistics();
     setnotCreatedClasses(res);
   }
   else{
     //code here
   }
  }
  const [Regulation, setRegulation] = useState("");
  const [disablereg, setdisablereg] = useState(true);
  const [regoptionss, setregoptionss] = useState([]);
  async function regoptions() {
    const res = await fetchRegulationOptions();
    setregoptionss(res.data);
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Navbar
        style={{ marginBottom: "30px" }}
        title={"HOD"}
        logout={true}
        backURL={isEnrolled ? "/faculty/classlist" : "/faculty/enroll"}
      />
      <div className="root-hod">
        <p className="dep-title">
          <u>View Department Grades</u>
        </p>

        <span className="dd-text">Course</span>
        <Select
          placeholder=""
          className="selectHOD"
          options={klass}
          onChange={(selectedCourse) => {
            setCourse(selectedCourse);
            filterDep(selectedCourse);
            regoptions();
          }}
        />

        <span className="dd-text">Year</span>
        <Select
          placeholder=""
          className="selectHOD"
          options={
            Course.value[0] === "M"
              ? MYears
              : currentUser.isFirstYearHOD
              ? [Years[0]]
              : [Years[1], Years[2], Years[3]]
          }
          isDisabled={!Course}
          onChange={async (selectedYear) => {
            setYear(selectedYear);
            setdisablereg(false);
          }}
        />
        <span className="dd-text">Regulation</span>
        <Select
          placeholder=""
          value={Regulation}
          isDisabled={disablereg}
          className="selectHOD"
          options={regoptionss}
          onChange={(r) => {
            setRegulation(r);
            setdisabledep(false);
          }}
        />

        <span className="dd-text">Department</span>
        <Select
          className="selectHOD"
          placeholder=""
          options={showdep}
          isDisabled={disabledep}
          onChange={async (d) => {
            setDep(d);

            setsections((c) => {
              return { ...c };
            });

            setdisablesec(false);
          }}
        />

        <span className="dd-text">Section</span>
        <Select
          className="selectHOD"
          placeholder=""
          options={sections[dep.label]}
          isDisabled={disablesec}
          onChange={(selectedSection) => {
            setSection(selectedSection);
          }}
        />

        <span className="dd-text">Subject</span>
        <Select
          className="selectHOD"
          placeholder=""
          options={subjects[dep.label]}
          isDisabled={!Section}
          onChange={(selectedSubject) => {
            setSubject(selectedSubject);
            setButton(false);
          }}
        />

        <Button
          icon={<i class="fas fa-search"></i>}
          className="normal hod-button"
          disabled={button}
          onClick={handleClick}
          children="View"
        />
      </div>
    </>
  );
};

export default HODSearch;
