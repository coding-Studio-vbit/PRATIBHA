import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";
import { ExportCSV } from "../../../export/ExportCSV";
import { db } from "../../../../firebase";
import { Spinner } from "../../../global_ui/spinner/spinner";
import {
  doc,
  collection,
  where,
  getDoc,
  query,
  getDocs,
} from "firebase/firestore";

const ListofStudents = () => {
  const [isInfo, setIsInfo] = useState(false);
  const [data, setData] = useState([]);

  const Fetchdata = async () => {
    const studentref = query(
      collection(db, `faculty/cse@vbithyd.ac.in/2_CSE_D_DAA`)
    );

    await getDocs(studentref).then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const email = doc.id.toString() + "@vbithyd.ac.in";
        const mid1 =
          doc.data()["mid1"]["criteria1"] +
          doc.data()["mid1"]["criteria2"] +
          doc.data()["mid1"]["criteria3"] +
          doc.data()["mid1"]["criteria4"] +
          doc.data()["mid1"]["criteria5"];
        const mid2 =
          doc.data()["mid2"]["criteria1"] +
          doc.data()["mid2"]["criteria2"] +
          doc.data()["mid2"]["criteria3"] +
          doc.data()["mid2"]["criteria4"] +
          doc.data()["mid2"]["criteria5"];
        // console.log(email);

        await fetchuser(email)
          .then((returndata) => {
            let topic, name;

            topic = returndata["subjects"]["DAA"]["topic_title"];
            name = returndata.name;
            const dataobj = {
              ROLL_NO: doc.id.toString(),
              STUDENT_NAME: name,
              TOPIC_NAME: topic,
              MID_1: mid1,
              MID_2: mid2,
            };
            return dataobj;
          })
          .then((dataobj) => {
            setData((data) => [...data, dataobj]);
            // data.sort((a, b) => (a.ROLL_NO > b.ROLL_NO ? 1 : -1));
            // console.log(data);
          });
      });
    });
  };

  const fetchuser = async (email) => {
    console.log(email);
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);
    // console.log(userDoc.data());
    return userDoc.data();
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
  // if (isInfo === true) {
  console.log(data);
  // }

  return (
    <div>
      <Navbar title="3_CSE_D_DA" pra={true} />
      {!data.length ? (
        <div className="spinnerload">
          <Spinner radius={2} />
        </div>
      ) : (
        <>
          <div className="sub_body">
            <p>SUBJECT : Data Analytics</p>
            <p>No. of students enrolled: 68</p>
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
              <Button children="GRADE" width="200" className="rare" />
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
