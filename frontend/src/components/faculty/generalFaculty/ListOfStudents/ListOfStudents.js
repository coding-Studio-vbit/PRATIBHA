import React, { useState, useEffect } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchisMid1,
  fetchisMid2,
  fetchSemNumber,
} from "../../../student/services/studentServices";
import { getAllStudents } from "../../services/facultyServices";

const ListofStudents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const [buttonText, setButtonText] = useState("EDIT PRA");
  const [student, setStudent] = useState(null);
  const [studentTopic, setStudentTopic] = useState(null);
  const [mid, setMid] = useState("");
  const [sem, setSem] = useState("");
  const [mid2err, setmid2err] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const val = location.state.sub;
  const subjectval = val.split("_");
  const course =
    subjectval[0] +
    "_" +
    subjectval[1] +
    "_" +
    subjectval[2] +
    "_" +
    subjectval[3] +
    "_" +
    subjectval[4];
  let title =
    subjectval[0] +
    " " +
    subjectval[2] +
    " " +
    subjectval[3] +
    " " +
    subjectval[4];
  if (subjectval[0] === "MBA" && subjectval[1] == "1") {
    title = subjectval[0] + " " + subjectval[2] + " " + subjectval[4];
  }

  let Course = subjectval[0],
    regulation = subjectval[1],
    year = subjectval[2],
    branch = subjectval[3],
    section = subjectval[4],
    subject = subjectval[5];

  const Fetchdata = async (
    Course,
    regulation,
    year,
    branch,
    section,
    subject,
    val
  ) => {
    const studentref = query(
      doc(
        db,
        `classesinfo/${Course}_${regulation}_${year}_${branch}_${section}`
      )
    );
    let ismid1 = await fetchisMid1(Course, year);
    let ismid2 = await fetchisMid2(Course, year);

    if (ismid1) {
      setMid(1);
    }
    if (ismid2) {
      setMid(2);
    }

    let semester = await fetchSemNumber();
    setSem(semester);

    let classDoc = await getDoc(studentref);
    if (classDoc.exists()) {
      let doc = classDoc.data();
      if (doc["students"]) {
        await getAllStudents(
          doc["students"],
          subject,
          ismid1,
          ismid2,
          false,
          val
        ).then((res) => {
          if (res) {
            setData(res.data);
            setStudent(res.student);
            setStudentTopic(res.studentTopic);
          } else {
            setError("ERROR OCCURED");
          }
        });
      } else {
        setError("NO STUDENTS HAVE ENROLLED TO THIS CLASS");
      }
    } else {
      setError("THIS CLASS DOES NOT EXIST");
    }
    setloading(false);
  };

  const Fetchsubject = async () => {
    try {
      const subjectRef = doc(db, "subjects", `${course}`);
      const subjectDoc = await getDoc(subjectRef);
      if (subjectDoc.exists()) {
        let document = subjectDoc.data();
        if (document["subjects"]) {
          let obj = document["subjects"].find(
            (o) => o.subject === subjectval[5]
          );
          if (obj) {
            setButtonText("EDIT PRA");
            let ismid2 = await fetchisMid2(subjectval[0], subjectval[2]);
            if (ismid2) {
              if (!obj.deadline2) {
                setmid2err(true);
              }
            }
          }
        }
      } else {
        setError("NO CLASS");
      }
    } catch (e) {
      setError("UNKNOWN_ERROR");
    }
  };

  useEffect(() => {
    Fetchdata(Course, regulation, year, branch, section, subject, val);
    Fetchsubject();
  }, []);

  return (
    <div>
      <Navbar backURL={"/faculty/classlist"} title={title}>
        <span
          onClick={() =>
            navigate("/faculty/createPra", {
              state: { sub: location.state.sub, editPRA: true },
            })
          }
          style={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {buttonText}
        </span>
      </Navbar>
      <p className="bold subject">SUBJECT : {subjectval[5]}</p>
      {mid2err && (
        <p className="mid2err">
          <u>Please set deadline for Mid 2 to open Submissions.</u>
        </p>
      )}
      {loading ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : error ? (
        <div className="err_Display">{error}</div>
      ) : (
        <>
          <div className="sub_body">
            <p className="bold">Number of students enrolled: {data.length}</p>
            <table style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>ROLL.NO</th>
                  <th>STUDENT NAME</th>
                  <th>TOPIC NAME</th>
                  <th>MID-1 MARKS</th>
                  <th>MID-2 MARKS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data
                    .sort((a, b) => (a.ROLL_NO < b.ROLL_NO ? -1 : 1))
                    .map((dataitem) => (
                      <tr
                        key={dataitem.ROLL_NO}
                        onClick={() => {
                          navigate("/faculty/grading", {
                            state: {
                              studentmail: dataitem.ROLL_NO + "@vbithyd.ac.in",
                              className: location.state.sub,
                              path:
                                subjectval[0] +
                                "/" +
                                subjectval[1] +
                                "/" +
                                subjectval[2] +
                                "/" +
                                subjectval[3] +
                                "/" +
                                subjectval[4] +
                                "/" +
                                subjectval[5] +
                                "/" +
                                `${mid}` +
                                "/" +
                                dataitem.ROLL_NO,
                              topicname: dataitem.TOPIC_NAME,
                            },
                          });
                        }}
                      >
                        <td>{dataitem.ROLL_NO}</td>
                        <td>{dataitem.STUDENT_NAME}</td>
                        <td>{dataitem.TOPIC_NAME}</td>
                        <td>{dataitem.MID_1}</td>
                        <td>{dataitem.MID_2}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="LOF_buttons">
              <Button
                children="GRADE"
                onClick={() => {
                  navigate("/faculty/grading", {
                    state: {
                      studentmail: student + "@vbithyd.ac.in",
                      className: location.state.sub,
                      path:
                        subjectval[0] +
                        "/" +
                        subjectval[1] +
                        "/" +
                        subjectval[2] +
                        "/" +
                        subjectval[3] +
                        "/" +
                        subjectval[4] +
                        "/" +
                        subjectval[5] +
                        "/" +
                        `${mid}` +
                        "/" +
                        student,
                      topicname: studentTopic,
                    },
                  });
                }}
                width="200"
                className="rare grade-button"
              />
            </div>
          </div>
          <div className="export_">
            <ExportCSV
              csvData={data}
              fileName={
                sem === 1
                  ? location.state.sub + "_sem1"
                  : location.state.sub + "_sem2"
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ListofStudents;
