import React, { useState, useEffect } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import { Spinner } from "../../global_ui/spinner/spinner";
import { db } from "../../../firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import {
  getStudentData,
  fetchisMid1,
  fetchisMid2,
} from "../services/studentServices";
import { useAuth } from "./../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../global_ui/spinner/spinner";
import Card_ from "../../global_ui/card/card_";
import "./SubjectlistStyles.css";
import Dialog from "../../global_ui/dialog/dialog";
import { getCoeDeadline } from "../../faculty/services/facultyServices";

const SubjectsList = () => {
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(null);

  let navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [userDoc, setuserDoc] = useState(null);
  const [courseTitle, setCourseTitle] = useState(" ");
  const [course, setcourse] = useState("");
  const[regulation,setregulation]=useState("");
  const [year, setyear] = useState("");

  const { currentUser } = useAuth();

  const fetchdata = async () => {
    const { document, error } = await getStudentData(`${currentUser.email}`);
    if (error == null) {
      setuserDoc(document);
      setcourse(document.course);
      setyear(document.year);
      setregulation(document.regulation);
      console.log(document);
      let course =
        document.course +
        "_" +
        document.regulation+
        "_"+
        document.year +
        "_" +
        document.department +
        "_" +
        document.section;
      setCourseTitle(document.course + "_"+ document.year +"_"+document.department+  "_" + document.section);

      if (document.course === "MBA"&&document.year==='1') {
        setCourseTitle(
          document.course + "_" + document.year + "_" + document.section
        );
      }
      let ismid1 = await fetchisMid1(document.course, document.year);
      let ismid2 = await fetchisMid2(document.course, document.year);
      let coeDeadLine, dlDate, mid;
      console.log(ismid1,ismid2);

      if (ismid1) {
        dlDate = await getCoeDeadline("1", document.course, document.year);
        mid = 1;
      }
      else if (ismid2) {
        dlDate = await getCoeDeadline("2", document.course, document.year);
        mid = 2;
      }
      if(dlDate!=null){

        console.log(mid);
        coeDeadLine = new Timestamp(
          dlDate.data["seconds"],
          dlDate.data["nanoseconds"]
        ).toDate();
  
        await fetchsubject(document, coeDeadLine, course, mid);
      }
      else{
        setError("Cannot Enroll");
      }
    } else {
      setError(error);
    }
    setloading(false);
  };

  const fetchsubject = async (document, coedeadLine, course, midvalue) => {
    let mid;
    let date, dateConv;
    const subjectRef = doc(db, "subjects", course);
    await getDoc(subjectRef).then(async (subjectDoc) => {
      if (subjectDoc.exists()) {
        const res = subjectDoc.data()["subjects"];
        await res.map(async (item, index) => {
          let date1 = new Timestamp(
            item["deadline1"].seconds,
            item["deadline1"].nanoseconds
          ).toDate();
          let newDate = new Date();
          let currentDateConv = newDate.toLocaleDateString("en-US");

          if (midvalue === 1) {
            mid = 1;

            date = date1.toLocaleDateString("en-GB");
            dateConv = date1.toLocaleDateString("en-US");
          } else {
        
            mid = 2;
            if (item["deadline2"]) {
              let date2 = new Timestamp(
                item["deadline2"].seconds,
                item["deadline2"].nanoseconds
              ).toDate();
              date = date2.toLocaleDateString("en-GB");
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
          await fetchusersubject(document, date, mid, item.subject, isWeek);
        });
      } else {
        setError("Submissions are not open for any subject.");
      }
    });
  };

  const fetchusersubject = async (document, date, mid, subject, isWeek) => {
    try {
      const subjectsdata = document["subjects"];
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
      <p className="userDetails">Roll Number : {currentUser.email.slice(0,10)}</p>
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
                  <div
                    onClick={() => {
                      if (dataitem.STATUS != "Graded") {
                        navigate("/student/uploadPRA", {
                          state: {
                            rollno: `${currentUser.email}`,
                            subject: dataitem.SUBJECT,
                            course: course,
                            regulation:regulation,
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
