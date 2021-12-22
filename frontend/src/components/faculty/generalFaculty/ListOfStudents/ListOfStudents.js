import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import {db}   from "../../../../firebase";
import { doc, collection, where, getDoc} from "firebase/firestore";
// import { AuthContext } from "../../../context/AuthContext";

// import {collection, getDoc} from "firebase/firebase-firestore";

const ListofStudents = () => {
  const [info, setInfo] = useState([]);
  // const {user} = useContext(AuthContext);
  const Fetchdata = async() => {
    console.log("aatt");
    const q = doc(db, "faculty", "cse@vbithyd.ac.in", "3_CSED_DM", "COcmAgICmUQfSaOIWoKN");
    const docSnap = await getDoc(q);
    console.log(docSnap);

    // if(docSnap.exist()){
    //   console.log(docSnap.data());
    // }


    // db.collection("faculty")
    //   .doc("cse@vbithyd.ac.in")
    //   .get().then((query) => {
    //     query.forEach((doc)=>{
    //       console.log(`${doc.id} => ${doc.data()}`);
    //     })
    //   })
      // .collection("3_CSED_DM")
      // .get()
      // .then((document) => {
      //   document.forEach((student) => {
      //     console.log(student);
      //     student.forEach((element) => {
      //       var data = element.data();
      //       setInfo((arr) => [...arr, data]);
      //     });
      //   });
      // });
  };

  useEffect(() => {
    Fetchdata();
  }, []);

  const data = [
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
  console.log(info);
  return (
    <div>
      <Navbar title="3_CSE_D_DA" pra={true} />
      <div className="sub_body">
        <p>SUBJECT : Data Analytics</p>
        <p>No. of students enrolled: 68</p>
        {/* <div> */}
        <table style={{ marginTop: "4.5rem" }}>
          <tr>
            <th>ROLL NO</th>
            <th>STUDENT NAME</th>
            <th>TOPIC NAME</th>
            <th>MID-1 GRADING</th>
            <th>MID-2 GRADING</th>
          </tr>
          {data &&
            data.map((dataitem) => (
              <tr>
                <td>{dataitem.ROLL_NO}</td>
                <td>{dataitem.STUDENT_NAME}</td>
                <td>{dataitem.TOPIC_NAME}</td>
                <td>{dataitem.MID_1}</td>
                <td>{dataitem.MID_2}</td>
              </tr>
            ))}
        </table>
        {/* </div> */}
        <div className="LOF_buttons">
          <Button children="GRADE" width="200" className="rare" />
        </div>
      </div>
      <div className="export_">
        <ExportCSV csvData={data} fileName="3_CSE_D_DA" />
      </div>
    </div>
  );
};

export default ListofStudents;
