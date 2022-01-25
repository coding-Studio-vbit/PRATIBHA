import React, { useState, useEffect } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { getStudentData } from "../../../student/services/studentServices";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchisMid1,
  fetchisMid2,
  fetchSemNumber
} from "../../../student/services/studentServices";


const ListofStudents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const [buttonText, setButtonText] = useState("EDIT PRA");
  const [student, setStudent] = useState(null);
  const [studentTopic, setStudentTopic] = useState(null);
  const [mid, setMid] = useState("");
  const [sem, setSem] = useState("");
  const[mid2err,setmid2err]=useState(false);
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
    subjectval[3]+
    "_"+
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

  

  const Fetchdata = async () => {
    var isData = false;
    const studentref = query(
      collection(db, `faculty/${currentUser.email}/${location.state.sub}`)
    );
    let stddd = null;
    let ismid1 = await fetchisMid1(subjectval[0], subjectval[2]);
    let ismid2 = await fetchisMid2(subjectval[0], subjectval[2]);
    if (ismid1) {
      setMid(1);
    }
    if (ismid2) {
      setMid(2);
    }

    let semester = await fetchSemNumber();
    setSem(semester);

    await getDocs(studentref).then((querySnapshot) => {
      if (querySnapshot) {
        querySnapshot.forEach(async (doc) => {
          const email = doc.id.toString() + "@vbithyd.ac.in";
          const docData = doc.data();
          let Innovation1 = "",
            Innovation2 = "",
            Subject_Relevance1 = "",
            Subject_Relevance2 = "",
            Individuality1 = "",
            Individuality2 = "",
            Preparation1 = "",
            Preparation2 = "",
            Presentation1 = "",
            Presentation2 = "";
          if (docData["mid1"]) {
            Innovation1 = docData["mid1"]["Innovation1"];
            Subject_Relevance1 = docData["mid1"]["Subject_Relevance1"];
            Individuality1 = docData["mid1"]["Individuality1"];
            Preparation1 = docData["mid1"]["Preparation1"];
            Presentation1 = docData["mid1"]["Presentation1"];
          } else {
            if (stddd === null && ismid1) {
              if (doc.id.toString() !== currentUser.email) {
                setStudent(doc.id.toString());
                stddd = doc.id.toString();
              }
            }
          }
          if (docData["mid2"]) {
            Innovation2 = docData["mid2"]["Innovation2"];
            Subject_Relevance2 = docData["mid2"]["Subject_Relevance2"];
            Individuality2 = docData["mid2"]["Individuality2"];
            Preparation2 = docData["mid2"]["Preparation2"];
            Presentation2 = docData["mid2"]["Presentation2"];
          } else {
            if (stddd === null && ismid2) {
              if (doc.id.toString() !== currentUser.email) {
                setStudent(doc.id.toString());
                stddd = doc.id.toString();
              }
            }
          }
          const mid1 = docData["mid1"]
            ? Innovation1 +
              Subject_Relevance1 +
              Individuality1 +
              Preparation1 +
              Presentation1
            : " ";
          const mid2 = ismid2 ?( docData["mid2"]
            ? (Innovation2 +
              Subject_Relevance2 +
              Individuality2 +
              Preparation2 +
              Presentation2)
            : docData["isSubmitted2"] 
            ? "Not Graded": "Not Submitted"):" ";

          await getStudentData(email)
            .then(({ document, error }) => {
              let returndata = document;
              let topic, name;

              if (error == null) {
                isData = true;
                let obj = returndata["subjects"].find(
                  (o) => o.subject === subjectval[5]
                );
                if (obj) {
                  topic = obj.topic;
                  name = returndata.name;
                  if (stddd === doc.id.toString()) {
                    setStudentTopic(topic);
                  }
                }
                const dataobj = {
                  ROLL_NO: doc.id.toString(),
                  STUDENT_NAME: name,
                  TOPIC_NAME: topic,
                  Innovation1: Innovation1,
                  Subject_Relevance1: Subject_Relevance1,
                  Individuality1: Individuality1,
                  Preparation1: Preparation1,
                  Presentation1: Presentation1,
                  MID_1: mid1,
                  Innovation2: Innovation2,
                  Subject_Relevance2: Subject_Relevance2,
                  Individuality2: Individuality2,
                  Preparation2: Preparation2,
                  Presentation2: Presentation2,
                  MID_2: mid2,
                };
                return dataobj;
              } else {
                return null;
              }
            })
            .then((dataobj) => {
              if (dataobj) {
                setData((data) => [...data, dataobj]);
              }
            });
          if (!isData) {
            setError("NO SUBMISSIONS FROM STUDENTS");
          }
        });
      } else {
        setError("NO SUBMISSIONS FROM STUDENTS");
      }
    });
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
            if(ismid2){
              if(!obj.deadline2){
                setmid2err(true)
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
    Fetchdata();
    Fetchsubject();
  }, []);

  return (
    <div>
      <Navbar
        backURL={
          "/faculty/classlist"
        }
        title={title}
      >
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
      {mid2err && <p className="mid2err"><u>Please set deadline for Mid 2 to open Submissions.</u></p>}
      {loading ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : error ? (
        <div className="err_Display">{error}</div>
      ) : (
        <>
          <div className="sub_body">
            <p className="bold">Number of students submitted: {data.length}</p>
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
                                subjectval[5]+
                                "/"+
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
                        subjectval[5]+
                        "/"+
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
