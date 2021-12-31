import React, { useState, useEffect } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import "../../faculty/generalFaculty/ListOfStudents/ListOfStudents.css";
import EditIcon from "@mui/icons-material/Edit";
import { Spinner } from "../../global_ui/spinner/spinner";
import { db } from "../../../firebase";
import { doc, getDoc,Timestamp } from "firebase/firestore";
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
      let date = new Timestamp(adminDoc.data()["coeDeadline"]["seconds"],adminDoc.data()["coeDeadline"]["nanoseconds"]).toDate();
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
    let deadline, date, mid;
    const subjectRef = doc(db, "subjects", course);
    await getDoc(subjectRef).then(async (subjectDoc) => {
      if (subjectDoc.exists()) {
        const res = subjectDoc.data()["subjects"];
        await res.map(async (item, index) => {
       
          
          let  date1 = new Timestamp(item['deadline1'].seconds,item['deadline1'].nanoseconds).toDate();
          console.log(date1);
          if (coedeadLine > date1) {
            console.log("1");
            mid = 1;

            date=date1.toLocaleDateString('en-GB');
          } else {
          
            mid = 2;
            if(item["deadline2"])
            {


              let  date2 = new Timestamp(item['deadline2'].seconds,item['deadline2'].nanoseconds).toDate();
               date=date2.toLocaleDateString('en-GB');
          } 
            
            
          }
          
          console.log(date);
        // let  date = new Timestamp(deadline.seconds,deadline.nanoseconds).toDate(); 
        //   let date = new Date(seconds * 1000);
        //   deadline =
        //     date.getDate().toString() +
        //     "-" +
        //     (date.getMonth() + 1).toString() +
        //     "-" +
        //     date.getFullYear().toString();

          await fetchusersubject(document, date, mid, item.subject);
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
              
              if (item.gradeStatus1 && item.mid_1) {
               
                gradetype = "Graded";
              } else if (!item.gradeStatus1 && item.mid_1) {
                gradetype = "Submitted for Grading";
              } else {
                gradetype = "Not Submitted";
              }
            } else {
              if (item.gradeStatus2 && item.mid_2) {
                gradetype = "Graded";
              } else if (!item.gradeStatus2 && item.mid_2) {
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
