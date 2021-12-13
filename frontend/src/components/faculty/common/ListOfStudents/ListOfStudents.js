import React from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "./ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";

const ListofStudents = () => {
  const data = [
    {
      ROLL_NO: "19P6XXXXX1",
      NAME: "ABCDEFGH",
      MID_1: "9",
      MID_2: "10",
    },
    {
      ROLL_NO: "19P6XXXXX2",
      NAME: "IJKLMNOP",
      MID_1: "10",
      MID_2: "9",
    },
    {
        ROLL_NO: "19P6XXXXX3",
        NAME: "QRSTUVWX",
        MID_1: "9",
        MID_2: "9",
      },
  ];
  return (
    <div>
      <Navbar title="3_CSE_D_DA" />
      <p>SUBJECT : Data Analytics</p>
      <p>No of students : 68</p>
      <table style={{  marginTop: "4.5rem" }}>
        <tr>
          <th>ROLL NO</th>
          <th>NAME</th>
          <th>MID-1 GRADING</th>
          <th>MID-2 GRADING</th>
        </tr>
        {data &&
          data.map((dataitem) => (
            <tr>
              <td>{dataitem.ROLL_NO}</td>
              <td>{dataitem.NAME}</td>
              <td>{dataitem.MID_1}</td>
              <td>{dataitem.MID_2}</td>
            </tr>
          ))}
      </table>
      <div className="LOF_buttons">
        <Button children="GRADE" width="200" className="rare" />
        
      </div>
      <div className="export_">
      <Button
          icon={<i class="fas fa-file-export"></i>}
          children="EXPORT"
          className="normal"
          width="150"
        />
      </div>
    </div>
  );
};

export default ListofStudents;
