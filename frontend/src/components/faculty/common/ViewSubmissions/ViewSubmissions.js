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
import { getAllStudents, Fetchlink } from "../../services/studentsDataServices";
import Download from "../../../global_ui/download/download";
import { useAuth } from "../../../context/AuthContext";
import { getAcademicYear } from "../../services/adminDeadlinesServices";

const ViewSubmissions = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [sem, setSem] = useState("");
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(null);
  const [mid, setMid] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [student, setStudent] = useState("");

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
    passedData.AcademicYear +
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
  //  regulation = passedData.Regulation,
    acadYear = passedData.AcademicYear,
    year = passedData.Year,
    branch = passedData.Dept,
    section = passedData.Section,
    subject = passedData.Subject;

  const getFileLink = async (rollno, mid1_status, mid2_status) => {
      setStudent(rollno);
      const res = await Fetchlink(rollno, mid, course);
      if(res === null){
        setStudent(null);
        setShowDialog("File does not exist");
      }else{
        setFileLink(res);
        setShowDialog("Download the File");
      }
      console.log(res);
      
  };

  const Fetchdata = async (
    Course,
    acadYear,
    year,
    branch,
    section,
    subject
  ) => {
    let classname = year+'_'+branch+'_'+section;
    const studentref = query(
      doc(
        db, "classesinfo", Course, acadYear, classname 
      )
    );
    let ismid1 = await fetchisMid1(Course, year);
    let ismid2 = await fetchisMid2(Course, year);

    if (ismid1) {
      setMid("1");
    }

    if (ismid2) {
      setMid("2");
    }

    let semester = await fetchSemNumber(Course, year);
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
        ).then((res) => {
          if (res) {
            setData(res.data);
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
    Fetchdata(Course, acadYear, year, branch, section, subject, course);
  }, []);

  return (
    <div>
      <Navbar
        title={title}
        backURL={
          currentUser.isHOD
            ? currentUser.isFirstTime
              ? "/faculty/HODSearch"
              : "/faculty/classlist"
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
              url={fileLink}
              rollNo={student}
              download={true}
              setShowDialog={setShowDialog}
              onOK={() => {
                setShowDialog(false);
              }}
            />
          )}
          <table>
            <thead>
              <tr>
                <th>S.NO</th>
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
                  .map((dataitem, index) => (
                    <tr key={dataitem.ROLL_NO}>
                      <td>{index + 1}</td>
                      <td>{dataitem.ROLL_NO}</td>
                      <td>{dataitem.STUDENT_NAME}</td>
                      <td>{dataitem.TOPIC_NAME}</td>
                      <td>{dataitem.MID_1}</td>
                      <td>{dataitem.MID_2}</td>
                      <td>
                        <center>
                          {/* <Download
                            className="viewsub-download"
                            url={links[dataitem.ROLL_NO]}
                            userID={dataitem.ROLL_NO}
                            setShowDialog={setShowDialog}
                          /> */}
                          <button
                            className="btn_download"
                            onClick={() =>
                              getFileLink(
                                dataitem.ROLL_NO,
                                dataitem.MID_1,
                                dataitem.MID_2
                              )
                            }
                          >
                            <i
                              class="fas fa-cloud-download-alt downloadIcon"
                              style={{
                                color: "#0E72AB",
                                fontSize: "28px",
                              }}
                            ></i>
                          </button>
                        </center>

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
