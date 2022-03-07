import React, { useState, useEffect } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ViewSubmissions.css";
import Dialog from "../../../global_ui/dialog/dialog";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { doc, getDoc, query } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import {
  fetchisMid1,
  fetchisMid2,
  fetchSemNumber,
} from "../../../student/services/studentServices";
import { getAllStudents } from "../../services/facultyServices";
import Download from "../../../global_ui/download/download";
import { useAuth } from "../../../context/AuthContext";

const ViewSubmissions = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [links, setLinks] = useState({});
  const [sem, setSem] = useState("");
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(null);

  const passedData = location.state;
  let title =
    passedData.Course +
    " " +
    passedData.Year +
    " " +
    passedData.Dept +
    " " +
    passedData.Section;

  let course;
  course = passedData.Course;

  const DepartmentForFaculty =
    passedData.Course +
    "_" +
    passedData.Regulation +
    "_" +
    passedData.Year +
    "_" +
    passedData.Dept +
    "_" +
    passedData.Section;
  course = DepartmentForFaculty + "_" + passedData.Subject;

  if (passedData.Course === "MBA" && passedData.Year === "1") {
    title =
      passedData.Course + " " + passedData.Year + " " + passedData.Section;
  }

  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

  let Course = passedData.Course,
    regulation = passedData.Regulation,
    year = passedData.Year,
    branch = passedData.Dept,
    section = passedData.Section,
    subject = passedData.Subject;

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
          true,
          val
        ).then((res) => {
          if (res) {
            setData(res.data);
            setLinks(res.links);
          } else {
            setError("ERROR OCCURED");
          }
        });
      } else {
        setError("NO STUDENTS HAVE TO ENROLLED THIS CLASS");
      }
    } else {
      setError("THIS CLASS DOES NOT EXIST");
    }
    setloading(false);
  };

  useEffect(() => {
    Fetchdata(Course, regulation, year, branch, section, subject, course);
  }, []);

  return (
    <div>
      <Navbar
        title={title}
        backURL={
          currentUser.isHOD
            ? "/faculty/classlist"
            : currentUser.isCOE
            ? "/faculty/coesearch"
            : ""
        }
        logout={true}
      />
      <p className="bold subject">SUBJECT : {passedData.Subject}</p>
      {loading ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : error ? (
        <div className="err_Display">{error}</div>
      ) : (
        //  data.length?
        <div className="sub_body">
          {showDialog && (
            <Dialog
              message={showDialog}
              onOK={() => {
                setShowDialog(false);
              }}
            />
          )}
          <table>
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
                        <center>
                          <Download
                            className="viewsub-download"
                            url={links[dataitem.ROLL_NO]}
                            userID={dataitem.ROLL_NO}
                            setShowDialog={setShowDialog}
                          />
                        </center>
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
        // ) : (
        //   <div className="err_Display">NO ONE ENROLLED IN THIS SUBJECT</div>
      )}
    </div>
  );
};

export default ViewSubmissions;

//this screen is common for HOD and CoE roles
