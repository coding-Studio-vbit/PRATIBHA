import React, { useState, useEffect } from "react";
import Navbar from "../../global_ui/navbar/navbar";
import "../../faculty/generalFaculty/ListOfStudents/ListOfStudents.css";
import EditIcon from "@mui/icons-material/Edit";
import { Spinner } from "../../global_ui/spinner/spinner";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStudentData } from "../services/studentServices";
import { useAuth } from "./../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SubjectsList = () => {
  const [data, setData] = useState([]);
  let nav = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [userDoc, setuserDoc] = useState(null);
  const [courseTitle, setCourseTitle] = useState(" ");

  const { currentUser } = useAuth();

  const fetchData = async () => {
    // const { document, error } = await getStudentData(currentUser.email);
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

      try {
        const subjectsdata = document["subjects"];
        await subjectsdata.map(async (item, index) => {
          const date = await Fetchsubject(item.subject, document);
          if (data) {
            let gradetype;
            if (item.isgraded_1 && item.mid_1) {
              gradetype = "Graded";
            } else if (!item.isgraded_1 && item.mid_1) {
              gradetype = "Submitted for Graded";
            } else {
              gradetype = "Not Submitted";
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
    } else {
      setError(error);
    }
    setloading(false);
  };

  const Fetchsubject = async (subject, document) => {
    let deadline;
    let course =
      document.course +
      "_" +
      document.year +
      "_" +
      document.department +
      "_" +
      document.section;
    const subjectRef = doc(db, "subjects", course);
    await getDoc(subjectRef).then((subjectDoc) => {
      if (subjectDoc.exists()) {
        const res = subjectDoc.data()["subjects"];
        res.map(async (item, index) => {
          if (subject === item.subject) {
            const seconds = item["deadline_1"]["seconds"];
            let date = new Date(seconds * 1000);
            deadline =
              date.getDate().toString() +
              "-" +
              (date.getMonth() + 1).toString() +
              "-" +
              date.getFullYear().toString();
          }
        });
      } else {
        setError("SUBJECT DOES NOT EXIST");
        return null;
      }
    });
    return deadline;
  };

  useEffect(() => {
    fetchData();
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
      <Navbar title={courseTitle} />
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
                    <tr key={dataitem.SUBJECT}>
                      <td>{dataitem.SUBJECT}</td>
                      <td>{dataitem.PRA_TOPIC}</td>
                      <td>{dataitem.STATUS}</td>
                      <td>{dataitem.SUBMIT_BEFORE}</td>
                      <td>
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
        <div>loading</div>
      )}
    </div>
  );
};

export default SubjectsList;
