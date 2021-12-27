import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { getStudentData } from "../../../student/services/studentServices";
import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ListofStudents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const [buttonText, setButtonText] = useState("CREATE PRA");
  const [student, setStudent] = useState(null);
  const location = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const val = location.state;
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
      collection(db, `faculty/${currentUser.email}/${location.state}`)
    );

    await getDocs(studentref).then((querySnapshot) => {
      if (querySnapshot) {
        querySnapshot.forEach(async (doc) => {
          const email = doc.id.toString() + "@vbithyd.ac.in";
          const docData = doc.data();
          const mid1 = docData["mid1"]
            ? docData["mid1"]["Innovation1"] +
              docData["mid1"]["Subject_Relevance1"] +
              docData["mid1"]["Individuality1"] +
              docData["mid1"]["Preparation1"] +
              docData["mid1"]["Presentation1"]
            : " ";
          const mid2 = docData["mid2"]
            ? docData["mid2"]["Innovation2"] +
              docData["mid2"]["Subject_Relevance2"] +
              docData["mid2"]["Individuality2"] +
              docData["mid2"]["Preparation2"] +
              docData["mid2"]["Presentation2"]
            : " ";

          await getStudentData(email)
            .then(({ document, error }) => {
              let returndata = document;
              let topic, name;

              if (error == null) {
                let obj = returndata["subjects"].find(
                  (o) => o.subject === subjectval[4]
                );
                topic = obj.topic;
                name = returndata.name;
                const dataobj = {
                  ROLL_NO: doc.id.toString(),
                  STUDENT_NAME: name,
                  TOPIC_NAME: topic,
                  MID_1: mid1,
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
          std1 = data[student]["ROLL_NO"].toString() + "@vbithyd.ac.in";
          break;
        }
      }
      for (var student = 0; student < data.length; student++) {
        if (data[student]["MID_2"] == " ") {
          std2 = data[student]["ROLL_NO"].toString() + "@vbithyd.ac.in";
        }
      }
    }
    var std = std1 ? std1 : std2;
    setStudent(std);
    return std;
  };

  useEffect(() => {
    Fetchdata();
    Fetchsubject();
    Fetchnumber();
  }, []);

  const Data = [
    {
      ROLL_NO: "19P6XXXXX1",
      STUDENT_NAME: "ABCDEFGH",
      TOPIC_NAME: "abcdefgh",
      MID_1: "9",
      MID_2: "10",
    },
    {
      ROLL_NO: "19P6XXXXX2",
      STUDENT_NAME: "IJKLMNOP",
      TOPIC_NAME: "ijklmnop",
      MID_1: "10",
      MID_2: " ",
    },
    {
      ROLL_NO: "19P6XXXXX3",
      STUDENT_NAME: "QRSTUVWX",
      TOPIC_NAME: "qrstuvwx",
      MID_1: "9",
      MID_2: "9",
    },
  ];
  return (
    <div>
      <Navbar title={location.state}>
        {" "}
        <span
          onClick={() =>
            navigate("/faculty/createPra", { state: location.state })
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
            <p>SUBJECT : {subjectval[4]}</p>
            <p>No. of students enrolled: {data.length}</p>
            {/* <div> */}
            <table style={{ marginTop: "4.5rem" }}>
              <thead>
                <tr>
                  <th>ROLL NO</th>
                  <th>STUDENT NAME</th>
                  <th>TOPIC NAME</th>
                  <th>MID-1 GRADING</th>
                  <th>MID-2 GRADING</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data
                    .sort((a, b) => (a.ROLL_NO > b.ROLL_NO ? -1 : 1))
                    .map((dataitem) => (
                      <tr
                        key={dataitem.ROLL_NO}
                        onClick={() => {
                          navigate("/faculty/grading", {
                            state: dataitem.ROLL_NO + "@vbithyd.ac.in"
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
                onClick={() => {
                  navigate("/faculty/grading", { state: student });
                }}
                width="200"
                className="rare"
              />
            </div>
          </div>
          <div className="export_">
            <ExportCSV csvData={data} fileName={location.state} />
          </div>
        </>
      )}
    </div>
  );
};

export default ListofStudents;
