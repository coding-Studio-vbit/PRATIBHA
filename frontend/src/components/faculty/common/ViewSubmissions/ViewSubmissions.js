import React from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "../ListOfStudents.css";
import Button from "../../../global_ui/buttons/button";

const ViewSubmissions = () => {
  const data = [
    {
      ROLL_NO: "19P6XXXXX1",
      TOPIC_NAME: "ABCDEFGH",
      MID_1: "9",
      MID_2: "10",
    },
    {
      ROLL_NO: "19P6XXXXX2",
      TOPIC_NAME: "IJKLMNOP",
      MID_1: "10",
      MID_2: "9",
    },
    {
      ROLL_NO: "19P6XXXXX3",
      TOPIC_NAME: "QRSTUVWX",
      MID_1: "9",
      MID_2: "9",
    },
  ];
  return (
    <div>
      <Navbar title="3_CSE_D_DA" logout={false} />
      <table style={{ marginTop: "4.5rem" }}>
        <tr>
          <th>ROLL NO:</th>
          <th>TOPIC_NAME</th>
          <th>MID-1 GRADING</th>
          <th>MID-2 GRADING</th>
        </tr>
        {data &&
          data.map((dataitem) => (
            <tr className="tablerow">
              <td>{dataitem.ROLL_NO}</td>
              <td>{dataitem.TOPIC_NAME}</td>
              <td>{dataitem.MID_1}</td>
              <td>{dataitem.MID_2}</td>
            </tr>
          ))}
      </table>
      <div className="LOF_buttons">
        <Button
          icon={<i class="fa fa-download" aria-hidden="true"></i>}
          children="DOWNLOAD"
          width="200"
          className="rare"
        />
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

export default ViewSubmissions;
