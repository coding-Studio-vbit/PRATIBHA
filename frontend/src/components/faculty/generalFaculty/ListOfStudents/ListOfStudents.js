import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import { doc, collection, getDoc, query, getDocs } from "firebase/firestore";
import { getStudentData } from "../../../student/services/studentServices";
import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import { useLocation, useNavigate } from "react-router-dom";

const ListofStudents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const location = useLocation()
  const navigate = useNavigate()
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
      MID_2: "-",
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
      <Navbar title={location.state} > <span
      onClick={()=>navigate('/faculty/createPra',{state:location.state})}
      style={{
        cursor:'pointer',
        fontWeight:'bold'
      }} >CREATE PRA</span>
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
            <p>SUBJECT : Data Analytics</p>
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
                      <tr key={dataitem.ROLL_NO}>
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
              <Button children="GRADE" onClick={()=>{
                navigate('/faculty/grading',{state:location.state})
              }} width="200" className="rare" />
            </div>
          </div>
          <div className="export_">
            <ExportCSV csvData={data} fileName="3_CSE_D_DA" />
          </div>
        </>
      )}
    </div>
  );
};

export default ListofStudents;
