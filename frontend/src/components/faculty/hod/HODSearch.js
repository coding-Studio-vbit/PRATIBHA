import React, { useEffect, useState } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar.js";
import Button from "../../global_ui/buttons/button";
import "./HODSearch.css";
import { useAuth } from "../../context/AuthContext.js";
import { fetchRegulationOptions } from "../../student/services/studentServices.js";
import { getDepartments } from "../services/facultyServices.js";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../global_ui/spinner/spinner";

const HODSearch = () => {
  const [Course, setCourse] = useState({ value: "Loading", label: "Loading" });
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
  }, []);
  function filterDep(course) {
    console.log("called filterdep");
    console.log(course);
    if (course.value !== "MBA" && !currentUser.isFirstYearHOD) {
      let showdeps = [];

      for (let j = 0; j < department.length; j++) {
        if (department[j].value === course.value) {
          showdeps.push(department[j]);
        }
      }
      setshowdep(showdeps);
      console.log(showdeps);
    }
  }

  useEffect(() => {
    const getLables = async () => {
      try {
        const res = await getDepartments(Course.value, Year.value);
        if (!res) return;
        setSubjects(res.subjects);
        console.log(res.sections);
        setsections(res.sections);
        if (Course.value === "MBA") {
          console.log("it is MBA");
          if (Year.value === "1") {
            console.log("it is mba 1");
            setdisabledep(true);
            setDep({
              value: "MBA",
              label: "Not Applicable",
            });
            setdisablesec(false);
          }
          if (Year.value === "2") {
            console.log("it is mba 2");
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
    console.log(
      Course.value +
        "_" +
        Year.value +
        "_" +
        Section.value +
        "_" +
        Subject.value
    );
    nav("/faculty/viewsubmissions", {
      state: {
        Course: Course.value,
        Year: Year.value,
        Regulation:Regulation.value,
        Dept: dep.label,
        Section: Section.value,
        Subject: Subject.value,
      },
    });
  }
  const [Regulation,setRegulation]=useState('');
  const[disablereg,setdisablereg]=useState(true);
  const[regoptionss,setregoptionss]=useState([]);
   async function regoptions(){
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
        backURL={"/faculty/classlist"}
      />
    <div className="root-hod">
      
      {/* <div className="div-container-classesHOD">
      {subs.btechSubs.length !== 0 && (
          <div className="subjectsDivision">
            <h4 className="courseTitle">B.Tech</h4>
            <div className="cardList-HOD">
              {subs.btechSubs.map((item) => {
                var displayItem = item.split("_");
                displayItem.splice(0, 1);
                let newItem = displayItem[1];
                let len = displayItem.length;
                for (let i = 2; i < len; i++) {
                  newItem = newItem + "-" + displayItem[i];
                }
                return (
                  <Card
                    key={newItem}
                    onclick={handleCard}
                    text={newItem}
                    subText={
                      subs.praSetSubs[item]
                        ? subs.praSetSubs[item].date2
                          ? `MID 2 Deadline: ${subs.praSetSubs[item].date2}`
                          : `MID 1 Deadline: ${subs.praSetSubs[item].date1}`
                        : "PRA not created."
                    }
                    klass={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {subs.mtechSubs.length !== 0 && (
          <div className="subjectsDivision">
            <h4 className="courseTitle"> M.Tech</h4>
            <div className="cardList-HOD">
              {subs.mtechSubs.map((item) => {
                var displayItem = item.split("_");
                displayItem.splice(0, 1);
                let newItem = displayItem[1];
                let len = displayItem.length;
                for (let i = 2; i < len; i++) {
                  newItem = newItem + "-" + displayItem[i];
                }
                return (
                  <Card
                    key={newItem}
                    onclick={handleCard}
                    text={newItem}
                    subText={
                      subs.praSetSubs[item]
                        ? subs.praSetSubs[item].date2
                          ? `MID 2 Deadline: ${subs.praSetSubs[item].date2}`
                          : `MID 1 Deadline: ${subs.praSetSubs[item].date1}`
                        : "PRA not created."
                    }
                    klass={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {subs.mbaSubs.length !== 0 && (
          <div className="subjectsDivision">
            <h4 className="courseTitle">MBA</h4>
            <div className="cardList-HOD">
              {subs.mbaSubs.map((item) => {
                var displayItem = item.split("_");
                displayItem.splice(0, 1);
                let newItem = displayItem[1];
                let len = displayItem.length;
                if (displayItem[1] === "1")
                  newItem =
                    newItem + "-" + displayItem[3] + "-" + displayItem[4];
                else {
                  for (let i = 2; i < len; i++) {
                    newItem = newItem + "-" + displayItem[i];
                  }
                }
                return (
                  <Card
                    key={newItem}
                    classname="card-container"
                    onclick={handleCard}
                    text={newItem}
                    subText={
                      subs.praSetSubs[item]
                        ? subs.praSetSubs[item].date2
                          ? `Mid 2: ${subs.praSetSubs[item].date2}`
                          : ` Mid 1: ${subs.praSetSubs[item].date1}`
                        : "PRA not created."
                    }
                    klass={item}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div> */}

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
              console.log(d);

              setsections((c) => {
                console.log(c);
                return { ...c };
              });
              console.log(sections);
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
