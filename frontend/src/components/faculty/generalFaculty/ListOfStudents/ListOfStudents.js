import React, { useState, useEffect, useContext } from "react";
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

const ListofStudents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const [buttonText, setButtonText] = useState("EDIT PRA");
  const [student, setStudent] = useState({});
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
    subjectval[3];

  const Fetchsubject = async () => {
    try {
      const subjectRef = doc(db, "subjects", `${course}`);
      const subjectDoc = await getDoc(subjectRef);
      if (subjectDoc.exists()) {
        let document = subjectDoc.data();
        if (document["subjects"]) {
          let obj = document["subjects"].find(
            (o) => o.subject === subjectval[4]
          );
          if (obj) {
            setButtonText("EDIT PRA");
          }
        }
      } else {
        setError("NO CLASS");
      }
    } catch (e) {
      setError("UNKNOWN_ERROR");
    }
  };

  const Fetchdata = async () => {
    const studentref = query(
      collection(db, `faculty/${currentUser.email}/${location.state.sub}`)
      // collection(db, `faculty/cse@vbithyd.ac.in/BTech_2_CSE_D_DAA`)
    );

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
          }
          if (docData["mid2"]) {
            Innovation2 = docData["mid2"]["Innovation2"];
            Subject_Relevance2 = docData["mid2"]["Subject_Relevance2"];
            Individuality2 = docData["mid2"]["Individuality2"];
            Preparation2 = docData["mid2"]["Preparation2"];
            Presentation2 = docData["mid2"]["Presentation2"];
          }
          const mid1 = docData["mid1"]
            ? Innovation1 +
              Subject_Relevance1 +
              Individuality1 +
              Preparation1 +
              Presentation1
            : " ";
          const mid2 = docData["mid2"]
            ? Innovation2 +
              Subject_Relevance2 +
              Individuality2 +
              Preparation2 +
              Presentation2
            : " ";

          await getStudentData(email)
            .then(({ document, error }) => {
              let returndata = document;
              let topic, name;

              if (error == null) {
                let obj = returndata["subjects"].find(
                  (o) => o.subject === subjectval[4]
                );
                if (obj) {
                  topic = obj.topic;
                  name = returndata.name;
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
        });
      } else {
        setError("NO ONE ENROLLED THIS SUBJECT");
      }
    });
    setloading(false);
  };

  const Fetchnumber = () => {
    var std1, std2;
    if (data) {
      for (var student = 0; student < data.length; student++) {
        if (data[student]["MID_1"] == " ") {
          console.log(data[student]);
          std1 = data[student];
          break;
        }
      }
      for (var student = 0; student < data.length; student++) {
        if (data[student]["MID_2"] == " ") {
          std2 = data[student];
        }
      }
    }
    var std = std1 ? std1 : std2;
    setStudent(std);
    console.log(std);
    return std;
  };

  useEffect(() => {
    Fetchdata();
    Fetchsubject();
    Fetchnumber();
  }, []);

  return (
    <div>
      <Navbar backURL={"/faculty/classlist"} title={location.state.sub}>
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
      {loading ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="sub_body">
            <p className="bold">SUBJECT : {subjectval[4]}</p>
            <p className="bold">Number of students submitted: {data.length}</p>
            {/* <div> */}
            <table style={{ marginTop: "4.5rem" }}>
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
                                "1" +
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
            {/* </div> */}
            <div className="LOF_buttons">
              <Button
                children="GRADE"
                // onClick={() => {
                //   navigate("/faculty/grading", { state: student });
                // }}
                onClick={async () => {
                  navigate("/faculty/grading", {
                    state: {
                      studentmail: data[0].ROLL_NO + "@vbithyd.ac.in",
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
                        "1" +
                        "/" +
                        student.ROLL_NO,
                      topicname: data[0].TOPIC_NAME,
                    },
                  });
                }}
                width="200"
                className="rare"
              />
            </div>
          </div>
          <div className="export_">
            <ExportCSV csvData={data} fileName={location.state.sub} />
          </div>
        </>
      )}
    </div>
  );
};

export default ListofStudents;
