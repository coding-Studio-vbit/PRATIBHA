import React, { useEffect, useState } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Timestamp } from "firebase/firestore";
import { getCoeDeadline, getSemDeadline } from "../services/facultyServices";
import { fetchSemNumber } from "../../student/services/studentServices";
import "./datepicker.css";
import "./deadlines.css";

export default function Deadlines() {
  const [course, setCourse] = useState({ value: "BTech", label: "BTech" });
  const [year, setYear] = useState({ value: "1", label: "1" });
  const [semNumber, setSemNumber] = useState(1);
  const [date1, setDate1] = useState(new Date(new Date().setHours(23, 59)));
  const [date2, setDate2] = useState(new Date(new Date().setHours(23, 59)));
  const [date3, setDate3] = useState(new Date(new Date().setHours(23, 59)));
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    async function semDeadline() {
      let n = await fetchSemNumber(course.value, year.value);
      console.log(n)
     setSemNumber(n);
      console.log(n)

    }
    semDeadline();
    console.log(semNumber)
    const fetchDeadlines = async () => {
      const res = await getCoeDeadline("1", course.value, year.value);
      console.log(res);
      if (res.data != null) {
        setDate1(
          new Timestamp(res.data.seconds, res.data.nanoseconds).toDate()
        );
      }
      const res2 = await getCoeDeadline("2", course.value, year.value);
      if (res2.data != null) {
        console.log(res2);
        setDate2(
          new Timestamp(res2.data.seconds, res2.data.nanoseconds).toDate()
        );
      }
      console.log(semNumber);
      const res3 = await getSemDeadline(
        semNumber,
        course.value,
        year.value
      );
      console.log(res3);
      if (res3.data != null) {
        console.log(res3);
        setDate3(
          new Timestamp(res3.data.seconds, res3.data.nanoseconds).toDate()
        );
      }
    };
    fetchDeadlines();
    console.log(date1, date2);
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

  return (
    <div>
      <Navbar title={"Deadlines"}></Navbar>
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
      <p className="dd-title-deadline"> SEM-{semNumber}</p>
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
    </div>
  );
}
