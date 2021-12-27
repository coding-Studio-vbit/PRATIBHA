import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../global_ui/navbar/navbar";
import "../../generalFaculty/ListOfStudents/ListOfStudents.css";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { getUploadedFile } from "../../../student/services/storageServices";
import { useLocation } from "react-router-dom";
import { getStudentData } from "../../../student/services/studentServices";
import { collection, query, getDocs } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

const ViewSubmissions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [links, setLinks] = useState({});
  const { currentUser } = useAuth();
  const location = useLocation();
  const passedData = location.state;
  let title =
    passedData.Year +
    "_" +
    passedData.Dept +
    "_" +
    passedData.Section +
    "_" +
    passedData.Subject;

  let course, courseName;
  if (passedData.Course === "B.Tech") {
    course = "BTech";
  } else if (passedData.Course === "M.Tech") {
    course = "MTech";
  }

  courseName = course;

  course = course + "_" + title;

  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

  const Fetchlink = async (rollnum) => {
    var dict = {};
    dict["rollno"] = rollnum;
    const res = await getUploadedFile(
      courseName,
      passedData.Year,
      passedData.Dept,
      passedData.Section,
      passedData.Subject,
      "2",
      rollnum + "@vbithyd.ac.in"
    );
    console.log(res);
    links[rollnum] = res.url;

    setLinks(links);
  };

  const Fetchdata = async () => {
    const studentref = query(
      collection(db, `faculty/${currentUser.email}/${course}`)
      // collection(db, `faculty/cse@vbithyd.ac.in/BTech_2_CSE_D_DAA`)
    );

    await getDocs(studentref).then((querySnapshot) => {
      if (querySnapshot) {
        querySnapshot.forEach(async (doc) => {
          const email = doc.id.toString() + "@vbithyd.ac.in";
          Fetchlink(doc.id.toString());
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
                  (o) => o.subject ===  passedData.Subject //"DAA"
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

  useEffect(() => {
    Fetchdata();
  }, []);

  const Data = [
    {
      ROLL_NO: "19P6XXXXX1",
      STUDENT_NAME: "abcdefgh",
      TOPIC_NAME: "ABCDEFGH",
      MID_1: "9",
      MID_2: "10",
    },
    {
      ROLL_NO: "19P6XXXXX2",
      STUDENT_NAME: "ijklmnop",
      TOPIC_NAME: "IJKLMNOP",
      MID_1: "10",
      MID_2: "9",
    },
    {
      ROLL_NO: "19P6XXXXX3",
      STUDENT_NAME: "qrstuvwx",
      TOPIC_NAME: "QRSTUVWX",
      MID_1: "9",
      MID_2: "9",
    },
  ];
  return (
    <div>
      <Navbar title={title} logout={true} />
      {loading ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="sub_body">
          <table style={{ marginTop: "4.5rem" }}>
            <thead>
              <tr>
                <th>ROLL NO:</th>
                <th>STUDENT NAME</th>
                <th>TOPIC NAME</th>
                <th>MID-1 GRADING</th>
                <th>MID-2 GRADING</th>
                <th>DOWNLOAD</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data
                  .sort((a, b) => (a.ROLL_NO > b.ROLL_NO ? -1 : 1))
                  .map((dataitem) => (
                    <tr key={dataitem.ROLL_NO}>
                      <td>{dataitem.ROLL_NO}</td>
                      <td>{dataitem.STUDENT_NAME}</td>
                      <td>{dataitem.TOPIC_NAME}</td>
                      <td>{dataitem.MID_1}</td>
                      <td>{dataitem.MID_2}</td>
                      <td>
                        <a
                          href={links[dataitem.ROLL_NO]}
                          style={{ textDecoration: "none" }}
                        >
                          <i
                            className="fa fa-download"
                            aria-hidden="true"
                            style={{ color: "rgba(11, 91, 138, 1)" }}
                          ></i>
                        </a>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="LOF_buttons">
            <ExportCSV csvData={data} fileName={course} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;

//this screen is common for HOD and CoE roles
