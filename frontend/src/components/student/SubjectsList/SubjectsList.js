import React, { useState, useEffect } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import { Spinner } from "../../global_ui/spinner/spinner";
import { db } from "../../../firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import {
  getStudentData,
  fetchisMid1,
  fetchisMid2,
  fetchSemNumber,
} from "../services/studentServices";
import { useAuth } from "./../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../global_ui/spinner/spinner";
import Card_ from "../../global_ui/card/card_";
import "./SubjectlistStyles.css";
import Dialog from "../../global_ui/dialog/dialog";
import { getCoeDeadline } from "../../faculty/services/adminDeadlinesServices";
import { getAcademicYear } from "../../faculty/services/adminDeadlinesServices";

const SubjectsList = () => {
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(null);

  let navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [userDoc, setuserDoc] = useState(null);
  const [courseTitle, setCourseTitle] = useState(" ");
  const [course, setcourse] = useState("");
  const [acadYear, setAcadYear] = useState("");
  const [year, setyear] = useState("");

  const { currentUser } = useAuth();

  const fetchdata = async () => {
    const { document, error } = await getStudentData(`${currentUser.email}`);
    if (error == null) {
      setuserDoc(document);
      setcourse(document.course);
      setyear(document.year);
      let academic_year = '';
      await getAcademicYear(document.course, document.year)
      .then((res)=> {
        academic_year = res.data;
        setAcadYear(res.data);
      });
      let semester = await fetchSemNumber(document.course,document.year);
      let course =
        document.course +
        "_" +
        academic_year+
        "_"+
        document.year +
        "_" +
        document.department +
        "_" +
        document.section;
      setCourseTitle(document.course + "_"+ document.year +"_"+document.department+  "_" + document.section);

      //should check with mba
      if (document.course === "MBA") {
        setCourseTitle(
          document.course + "_" + document.year + "_" + document.section
        );
      }
      let ismid1 = await fetchisMid1(document.course, document.year);
      let ismid2 = await fetchisMid2(document.course, document.year);
      let coeDeadLine, dlDate, mid;

      if (ismid1) {
        dlDate = await getCoeDeadline("1", document.course, document.year);
        mid = 1;
      }
      else if (ismid2) {
        dlDate = await getCoeDeadline("2", document.course, document.year);
        mid = 2;
      }
      if(dlDate!=null){
        coeDeadLine = new Timestamp(
          dlDate.data["seconds"],
          dlDate.data["nanoseconds"]
        ).toDate();
  
        await fetchsubject(document, coeDeadLine, course, mid, semester);
      }
      else{
        setError("Cannot Enroll");
      }
    } else {
      setError(error);
    }
    setloading(false);
  };


  //change subs collection
  //TODO REMOVE ACADYEAR DECLARATIONS!!
  const fetchsubject = async (document, coedeadLine, course, midvalue, semester) => {
    console.log(document,course,midvalue);
    let Course = course.split("_")[0];
    let acadYear = course.split("_")[1];
   // acadYear = "2021-22"
    let classroom = course.split("_")[2]+"_"+course.split("_")[3]+"_"+course.split("_")[4]
    let mid;
    let date, dateConv;
    console.log(Course,acadYear,classroom)
    const subjectRef = doc(db, "classesinfo", Course, acadYear, classroom);
    await getDoc(subjectRef).then(async (subjectDoc) => {
      if (subjectDoc.exists()) {
        console.log(subjectDoc.data());
        const res = subjectDoc.data()["subjects"];
        console.log(res)
        await res.map(async (item, index) => {
          let date1 = new Timestamp(
            item["deadline1"].seconds,
            item["deadline1"].nanoseconds
          ).toDate();
          let newDate = new Date();
          let currentDateConv = newDate.toLocaleDateString("en-US");

          if (midvalue === 1) {
            mid = 1;

            date = date1.toLocaleDateString("en-GB")+" "+date1.toLocaleTimeString("en-IN",{ hour: '2-digit', minute: '2-digit' });
            dateConv = date1.toLocaleDateString("en-US");
          } else {
        
            mid = 2;
            if (item["deadline2"]) {
              let date2 = new Timestamp(
                item["deadline2"].seconds,
                item["deadline2"].nanoseconds
              ).toDate();
              date = date2.toLocaleDateString("en-GB")+" "+date2.toLocaleTimeString("en-IN",{ hour: '2-digit', minute: '2-digit' });
              dateConv = date2.toLocaleDateString("en-US");
            }
          }

          var dateint = new Date(dateConv).getTime();
          var currdate = new Date(currentDateConv).getTime();
      
          var Difference_In_Time = dateint - currdate;
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          
          var isWeek = false;
          if (Difference_In_Days <= 7) {
            isWeek = true;
          }
          await fetchusersubject(document, date, mid, item.subject, isWeek, acadYear, semester);
        });
      } else {
        setError("Submissions are not open for any subject.");
      }
    });
  };

  const fetchusersubject = async (document, date, mid, subject, isWeek, acadYear, semester) => {
    try {
      let sem;
      if(semester === 1){
        sem = "sem1";
      }
      if(semester === 2){
        sem = "sem2";
      }
      const subjectsdata = document[acadYear][sem];
      await subjectsdata.map(async (item, index) => {
        if (item.subject === subject) {
          let gradetype,
            isSubmitted = false;
          if (date !== undefined) {
            if (mid === 1) {
              if (item.gradeStatus1 && item.mid_1) {
                gradetype = "Graded";
                isSubmitted = true;
              } else if (!item.gradeStatus1 && item.mid_1) {
                gradetype = "Submitted for Grading";
                isSubmitted = true;
              } else {
                gradetype = "Not Submitted";
              }
            } else {
              if (item.gradeStatus2 && item.mid_2) {
                gradetype = "Graded";
                isSubmitted = true;
              } else if (!item.gradeStatus2 && item.mid_2) {
                gradetype = "Submitted for Grading";
                isSubmitted = true;
              } else {
                gradetype = "Not Submitted";
              }
            }
          } else {
            gradetype = " ";
          }

          const resdata = {
            SUBJECT: item.subject,
            PRA_TOPIC: item.topic,
            STATUS: gradetype,
            SUBMIT_BEFORE: date,
            IS_WEEK: isWeek,
            IS_SUBMITTED: isSubmitted,
          };
          setData((data) => [...data, resdata]);
        }
      });
    } catch {
      setError("ERROR OCCURED");
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-body-subjects">
      <Navbar
        title={courseTitle.split("_").join(" ")}
        logout={true}
        back={false}
      />
      <p className="userDetails">Roll Number : {currentUser.email.slice(0,10).toUpperCase()}</p>
      <p className="userDetails">Name : {currentUser.username}</p>
      {!loading ? (
        error == null ? (
          <div className="subBody">
            {showDialog && (
              <Dialog
                message={showDialog}
                onOK={() => {
                  setShowDialog(false);
                }}
              />
            )}

            <div className="list-grid">
              {data &&
                data.map((dataitem) => (
                  <div key={dataitem.SUBJECT}
                    onClick={() => {
                      if (dataitem.STATUS !== "Graded") {
                        navigate("/student/uploadPRA", {
                          state: {
                            rollno: `${currentUser.email}`,
                            subject: dataitem.SUBJECT,
                            course: course,
                            acadYear:acadYear,
                            year: year,
                          },
                        });
                      } else {
                        setShowDialog("Cannot edit PRA after grading");
                      }
                    }}
                  >
                    <Card_
                      key={dataitem.SUBJECT}
                      subject={dataitem.SUBJECT}
                      pra={dataitem.PRA_TOPIC}
                      status={dataitem.STATUS}
                      date={dataitem.SUBMIT_BEFORE}
                      isWeek={dataitem.IS_WEEK}
                      isSubmitted={dataitem.IS_SUBMITTED}
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="listerror">{error}</div>
        )
      ) : (
        <div>
          <LoadingScreen />
        </div>
      )}
    </div>
  );
};

export default SubjectsList;
