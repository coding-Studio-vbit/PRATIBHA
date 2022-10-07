import React, { useEffect, useState } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Timestamp } from "firebase/firestore";
import { getCoeDeadline, getSemDeadline,setCoeDeadlines } from "../services/adminDeadlinesServices";
import { fetchSemNumber, fetchToSetSem } from "../../student/services/studentServices";
import "./datepicker.css";
import "./deadlines.css";
import Dialog from "../../global_ui/dialog/dialog";
import { Spinner } from "../../global_ui/spinner/spinner";

export default function Deadlines() {
  const [loading,setloading ] = useState(false);
  const [dialog,setdialog] = useState(false)
  const [course, setCourse] = useState({ value: "BTech", label: "BTech" });
  const [year, setYear] = useState({ value: "1", label: "1" });
  const [semNumber, setSemNumber] = useState(1);
  const [semToSet, setSemToSet] = useState(1);
  const [date1, setDate1] = useState(new Date(new Date().setHours(23, 59)));
  const [date2, setDate2] = useState(new Date(new Date().setHours(23, 59)));
  const [date3, setDate3] = useState(new Date(new Date().setHours(23, 59)));
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    console.log(loading)
    async function semDeadline() {
      let n = await fetchSemNumber(course.value, year.value);
      setSemNumber(n);
      let val = await fetchToSetSem(course.value, year.value);
      setSemToSet(val);
    }
    semDeadline();
  
    const fetchDeadlines = async () => {
      const res = await getCoeDeadline("1", course.value, year.value);
      if (res.data != null) {
        setDate1(
          new Timestamp(res.data.seconds, res.data.nanoseconds).toDate()
        );
      }
      const res2 = await getCoeDeadline("2", course.value, year.value);
      if (res2.data != null) {
        setDate2(
          new Timestamp(res2.data.seconds, res2.data.nanoseconds).toDate()
        );
      }

      let res3;
      if(semNumber != -1){
        res3 = await getSemDeadline(
          semNumber,
          course.value,
          year.value
        );
      }
      if(res3 != undefined){
        if (res3.data != null) {
          setDate3(
            new Timestamp(res3.data.seconds, res3.data.nanoseconds).toDate()
          );
        }
      }    
    };
    fetchDeadlines();
  }, [course, year,semNumber]);

  const Years = [
    //fetch from db for the selected course
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  const Courses = [
    { value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
    { value: "MBA", label: "MBA" },
  ];
  const MYears = [
    //fetch from db for the selected course
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];

async function handleSave(){
setloading(true)
    const res = await setCoeDeadlines(course.value,year.value,date1,date2,date3,semNumber)
    if (res.error==null){
      setloading(false)
      setdialog('Deadlines updated succesfully')
    }
    else {
      setloading(false)
      setdialog('Could not update deadlines')

    }
}

  return (
 
    <div>
      <Navbar title={"Deadlines"}   backURL={
          "/faculty/coesearch"
        }></Navbar>

      {!dialog ? (
      <div className="full-page">

    
      <p className="coeinstruction">Select course and year</p>
      <p className="dd-title-deadline">Course</p>
      <Select
        placeholder=""
        value={course}
        className="select-deadlines"
        options={Courses}
        onChange={(selectedCourse) => {
          setCourse(selectedCourse);
        }}
      />
      <p className="dd-title-deadline">Year</p>
      <Select
        value={year}
        placeholder=""
        className="select-deadlines"
        options={course.value[0] === "M" ? MYears : Years}
        isDisabled={!course}
        onChange={(selectedYear) => {
          setYear(selectedYear);
          
        }}
      />
      {loading ? <Spinner/>:<div className="deadlines-flex">
      <p className="dd-title-deadline"> MID-I </p>
      <div className="datepicker-flex">
        <DatePicker
          dateFormat="dd/MM/yyyy h:mm aa"
          selected={date1}
          value={date1}
          minDate={new Date()}
          filterTime={filterPassedTime}
          excludeTimes={[new Date(new Date().setHours(0, 0, 0, 0))]}
          showTimeSelect
          onChange={(newVal) => {
            setDate1(newVal);
          }}
          className="datepicker-deadlines"
        />
      </div>
      <p className="dd-title-deadline"> MID-II </p>
      <div className="datepicker-flex">
        <DatePicker
          dateFormat="dd/MM/yyyy h:mm aa"
          selected={date2}
          value={date2}
          minDate={new Date()}
          filterTime={filterPassedTime}
          excludeTimes={[new Date(new Date().setHours(0, 0, 0, 0))]}
          showTimeSelect
          onChange={(newVal) => {
            setDate2(newVal);
          }}
          className="datepicker-deadlines"
        />
      </div>
      {
      semNumber !== -1 ? 
      ( <p className="dd-title-deadline"> SEM-{semNumber}</p>) :
      ( <p className="dd-title-deadline"> set SEM-{semToSet}</p>)
      }

      <div className="datepicker-flex">
        <DatePicker
          dateFormat="dd/MM/yyyy h:mm aa"
          selected={date3}
          value={date3}
          minDate={new Date()}
          filterTime={filterPassedTime}
          excludeTimes={[new Date(new Date().setHours(0, 0, 0, 0))]}
          showTimeSelect
          onChange={(newVal) => {
            setDate3(newVal);
          }}
          className="datepicker-deadlines"
        />
      </div>
      <Button
            style={{ padding: "5px" }}
            className="deadlines-button normal"
          
            
            onClick={handleSave}
           children={'Save'}
          />
          </div>}
          </div>):(
<Dialog message={dialog}   onOK={() => {
            setdialog(false);
          }}/>
          )}
    </div>
  );
}
