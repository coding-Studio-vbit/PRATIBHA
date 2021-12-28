import React, { useState, useEffect } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import "../../faculty/generalFaculty/ListOfStudents/ListOfStudents.css";
import EditIcon from "@mui/icons-material/Edit";
import { Spinner } from "../../global_ui/spinner/spinner";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStudentData } from "../services/studentServices";
import { useAuth } from "./../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {LoadingScreen} from '../../global_ui/spinner/spinner'

const SubjectsList = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  let navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [userDoc, setuserDoc] = useState(null);
  const [courseTitle, setCourseTitle] = useState(" ");

  const { currentUser } = useAuth();

  const fetchDeadline = async () => {
    const adminRef = doc(db, "adminData", "coeDeadline");
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date = adminDoc.data()["coeDeadline"]["seconds"];
      return date;
    }
  };

  const fetchdata = async () => {
    const { document, error } = await getStudentData(`${currentUser.email}`);
    if (error == null) {
      setuserDoc(document);
      let course =
        document.course +
        "_" +
        document.year +
        "_" +
        document.department +
        "_" +
        document.section;
      setCourseTitle(course);

      let coedeadLine = await fetchDeadline();
      await fetchsubject(document, coedeadLine, course);
    } else {
      setError(error);
    }
    setloading(false);
  };

  const fetchsubject = async (document, coedeadLine, course) => {
    let deadline, seconds, mid;
    const subjectRef = doc(db, "subjects", course);
    await getDoc(subjectRef).then(async (subjectDoc) => {
      if (subjectDoc.exists()) {
        const res = subjectDoc.data()["subjects"];
        await res.map(async (item, index) => {
          const seconds1 = item["deadline1"]["seconds"];
          if (coedeadLine > seconds1) {
            // console.log("1");
            mid = 1;
            seconds = seconds1;
          } else {
            // console.log("2");
            mid = 2;
            seconds = item["deadline2"]["seconds"];
          }

          let date = new Date(seconds * 1000);
          deadline =
            date.getDate().toString() +
            "-" +
            (date.getMonth() + 1).toString() +
            "-" +
            date.getFullYear().toString();

          await fetchusersubject(document, deadline, mid, item.subject);
        });
      } else {
        // setError("SUBJECT DOES NOT EXIST");
      }
    });
  };

  const fetchusersubject = async (document, date, mid, subject) => {
    try {
      const subjectsdata = document["subjects"];
      await subjectsdata.map(async (item, index) => {
        if (item.subject === subject) {
          let gradetype;
          if (date !== undefined) {
            if (mid === 1) {
              if (item.isgraded_1 && item.mid_1) {
                gradetype = "Graded";
              } else if (!item.isgraded_1 && item.mid_1) {
                gradetype = "Submitted for Grading";
              } else {
                gradetype = "Not Submitted";
              }
            } else {
              if (item.isgraded_2 && item.mid_2) {
                gradetype = "Graded";
              } else if (!item.isgraded_2 && item.mid_2) {
                gradetype = "Submitted for Grading";
              } else {
                gradetype = "Not Submitted";
              }
            }
          } else {
            gradetype = " ";
          }

          const resdata = {
            SUBJECT: item.subject,
            PRA_TOPIC: item.topic ? item.topic : " ",
            STATUS: gradetype,
            SUBMIT_BEFORE: date,
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

  const Data = [
    {
      SUBJECT: "WT",
      PRA_TOPIC: "ABCDEFGH",
      STATUS: "Not Submitted",
      SUBMIT_BEFORE: "30-12-21",
    },
    {
      SUBJECT: "SE",
      PRA_TOPIC: "IJKLMNOP",
      STATUS: "Submitted for Grading",
      SUBMIT_BEFORE: "15-12-21",
    },
    {
      SUBJECT: "DAA",
      PRA_TOPIC: "QRSTUVWX",
      STATUS: "Graded",
      SUBMIT_BEFORE: "3-12-21",
    },
  ];

  return (
    <div>
      <Navbar title={courseTitle} logout={true} />
      {!loading ? (
        error == null ? (
          <div className="sub_body">
            <table style={{ marginTop: "4.5rem" }}>
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>PRA TOPIC</th>
                  <th>STATUS</th>
                  <th>SUBMIT BEFORE</th>
                  <th>EDIT</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((dataitem) => (
                    <tr className="single-row" onClick={() => {
                          navigate("/student/uploadPRA", { state:
                           {rollno :`${currentUser.email}`,
                           subject: dataitem.SUBJECT}
                          });
                        }} key={dataitem.SUBJECT}>
                      <td>{dataitem.SUBJECT}</td>
                      <td>{dataitem.PRA_TOPIC}</td>
                      <td>{dataitem.STATUS}</td>
                      <td>{dataitem.SUBMIT_BEFORE}</td>
                      <td
                        onClick={() => {
                          navigate("/student/uploadPRA", { state:
                           {rollno :`${currentUser.email}`,
                           subject: dataitem.SUBJECT}
                          });
                        }}
                      >
                        <EditIcon style={{ color: "rgba(11, 91, 138, 1)" }} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>{error}</div>
        )
      ) : (
        <div><LoadingScreen/></div>
      )}
    </div>
  );
};

export default SubjectsList;
