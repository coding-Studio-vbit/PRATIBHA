import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../global_ui/navbar/navbar";
import "../../generalFaculty/ListOfStudents/ListOfStudents.css";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useLocation } from "react-router-dom";
import { getStudentData } from "../../../student/services/studentServices";
import {
  doc,
  collection,
  where,
  getDoc,
  query,
  getDocs,
} from "firebase/firestore";

const ViewSubmissions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const location = useLocation();
  console.log(location.state);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

  const storage = getStorage();
  const gsReference = ref(
    storage,
    "gs://pratibha-d4e57.appspot.com/pra_ref/Prashanith-Resume.pdf"
  );
  const onclickdownload = () => {
    getDownloadURL(gsReference)
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        console.log(url);
        navigate(url);

        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();

        // Or inserted into an <img> element
        // const img = document.getElementById('myimg');
        // img.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
        console.log(error);
      });
  };

  const Fetchdata = async () => {
    const studentref = query(
      collection(db, `faculty/cse@vbithyd.ac.in/2_CSE_D_DAA`)
    );

    await getDocs(studentref).then((querySnapshot) => {
      if (querySnapshot) {
        querySnapshot.forEach(async (doc) => {
          const email = doc.id.toString() + "@vbithyd.ac.in";
          const docData = doc.data();
          const mid1 =
            docData["mid1"]["criteria1"] +
            docData["mid1"]["criteria2"] +
            docData["mid1"]["criteria3"] +
            docData["mid1"]["criteria4"] +
            docData["mid1"]["criteria5"];
          const mid2 =
            docData["mid2"]["criteria1"] +
            docData["mid2"]["criteria2"] +
            docData["mid2"]["criteria3"] +
            docData["mid2"]["criteria4"] +
            docData["mid2"]["criteria5"];

          await getStudentData(email)
            .then(({ document, error }) => {
              let returndata = document;
              let topic, name;

              if (error == null) {
                let obj = returndata["subjects"].find(
                  (o) => o.subject === "DAA"
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
      <Navbar title="3_CSE_D_DA" logout={false} />
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
                      <td onClick={onclickdownload}>
                        <i
                          className="fa fa-download"
                          aria-hidden="true"
                          style={{ color: "rgba(11, 91, 138, 1)" }}
                        ></i>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="LOF_buttons">
            <ExportCSV csvData={data} fileName="3_CSE_D_DA" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;

//this screen is common for HOD and CoE roles
