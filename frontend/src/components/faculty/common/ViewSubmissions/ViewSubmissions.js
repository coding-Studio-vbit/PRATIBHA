import React, { useState, useEffect } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "../../generalFaculty/ListOfStudents/ListOfStudents.css";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { getUploadedFileByPath } from "../../../student/services/storageServices";
import { useLocation } from "react-router-dom";
import {
  getStudentData,
  fetchisMid1,
  fetchisMid2,
} from "../../../student/services/studentServices";
import { collection, query, getDocs } from "firebase/firestore";
import { getPRA, getSemester } from "../../services/facultyServices";
import Download from "../../../global_ui/download/download";

const ViewSubmissions = () => {
  const [data, setData] = useState([]);
  const [links, setLinks] = useState({});
  const [sem, setSem] = useState("");
  const location = useLocation();
  const passedData = location.state;
  // console.log(passedData);
  let title =
    passedData.Year +
    "_" +
    passedData.Dept +
    "_" +
    passedData.Section +
    "_" +
    passedData.Subject;

  let course, courseName;
  if (passedData.Course === "BTech") {
    course = "BTech";
  } else if (passedData.Course === "MTech") {
    course = "MTech";
  }

  courseName = course;

  course = course + "_" + title;
  // console.log(course);
  const DepartmentForFaculty =
    passedData.Course +
    "_" +
    passedData.Year +
    "_" +
    passedData.Dept +
    "_" +
    passedData.Section;
  // console.log(DepartmentForFaculty);

  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

  const Fetchlink1 = async (email) => {
    var dict = {};
    let rollnum = email.split("@")[0];
    dict["rollno"] = rollnum;
    const res = await getUploadedFileByPath(
      courseName +
        "/" +
        passedData.Year +
        "/" +
        passedData.Dept +
        "/" +
        passedData.Section +
        "/" +
        passedData.Subject +
        "/" +
        "1" +
        "/" +
        email.split("@")[0]
    );
    links[rollnum] = res.url;

    setLinks(links);
  };

  const Fetchlink2 = async (email) => {
    var dict = {};
    let rollnum = email.split("@")[0];
    dict["rollno"] = rollnum;
    const res = await getUploadedFileByPath(
      courseName +
        "/" +
        passedData.Year +
        "/" +
        passedData.Dept +
        "/" +
        passedData.Section +
        "/" +
        passedData.Subject +
        "/" +
        "2" +
        "/" +
        email.split("@")[0]
    );
    links[rollnum] = res.url;

    setLinks(links);
  };

  const Fetchdata = async () => {
    const result = await getPRA(passedData.Subject, DepartmentForFaculty);
    const facultyID = result.facultyID;

    if (facultyID) {
      const studentref = query(
        collection(db, `faculty/${facultyID}/${course}`)
        // collection(db, `faculty/cse@vbithyd.ac.in/BTech_2_CSE_D_DAA`)
      );

      let ismid1 = await fetchisMid1(courseName, passedData.Year);
      let ismid2 = await fetchisMid2(courseName, passedData.Year);

      let semester = await getSemester();
      setSem(semester.data);

      await getDocs(studentref).then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach(async (doc) => {
            const email = doc.id.toString() + "@vbithyd.ac.in";
            // await Fetchlink(email);
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
              .then(async ({ document, error }) => {
                let returndata = document;
                let topic, name;

                if (error == null) {
                  if (ismid1) {
                    await Fetchlink1(email);
                  }
                  if (ismid2) {
                    await Fetchlink2(email);
                  }

                  let obj = returndata["subjects"].find(
                    (o) => o.subject === passedData.Subject //"DAA"
                  );
                  topic = obj.topic;
                  name = returndata.name;
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
    } else {
      setloading(false);
    }
  };

  useEffect(() => {
    Fetchdata();
  }, []);

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
                <th>ROLL NO</th>
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
                  .sort((a, b) => (a.ROLL_NO < b.ROLL_NO ? -1 : 1))
                  .map((dataitem) => (
                    <tr key={dataitem.ROLL_NO}>
                      <td>{dataitem.ROLL_NO}</td>
                      <td>{dataitem.STUDENT_NAME}</td>
                      <td>{dataitem.TOPIC_NAME}</td>
                      <td>{dataitem.MID_1}</td>
                      <td>{dataitem.MID_2}</td>
                      <td>
                        <Download
                          url={links[dataitem.ROLL_NO]}
                          userID={dataitem.ROLL_NO}
                        />
                        {/* <a
                          href={links[dataitem.ROLL_NO]}
                          target="_blank"
                          style={{ textDecoration: "none" }}
                        >
                          <i
                            className="fa fa-download"
                            aria-hidden="true"
                            style={{ color: "rgba(11, 91, 138, 1)" }}
                          ></i>
                        </a> */}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="LOF_buttons">
            <ExportCSV
              csvData={data}
              fileName={sem === 1 ? course + "_sem1" : course + "_sem2"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;

//this screen is common for HOD and CoE roles
