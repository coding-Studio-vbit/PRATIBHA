import React from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import "../../common/ListOfStudents/ListOfStudents";
import Button from "../../../global_ui/buttons/button";

const ViewSubmissions = () => {
  const data = [
    {
      ROLL_NO: "19P6XXXXX1",
      NAME: "abcdefgh",
      TOPIC_NAME: "ABCDEFGH",
      MID_1: "9",
      MID_2: "10",
    },
    {
      ROLL_NO: "19P6XXXXX2",
      NAME: "ijklmnop",
      TOPIC_NAME: "IJKLMNOP",
      MID_1: "10",
      MID_2: "9",
    },
    {
      ROLL_NO: "19P6XXXXX3",
      NAME: "qrstuvwx",
      TOPIC_NAME: "QRSTUVWX",
      MID_1: "9",
      MID_2: "9",
    },
  ];
  return (
    <div>
      <Navbar title="3_CSE_D_DA" logout={false} />
      <div className="sub_body">
        <table style={{ marginTop: "4.5rem" }}>
          <tr>
            <th>ROLL NO:</th>
            <th>NAME</th>
            <th>TOPIC NAME</th>
            <th>MID-1 GRADING</th>
            <th>MID-2 GRADING</th>
            <th>DOWNLOAD</th>
          </tr>
          {data &&
            data.map((dataitem) => (
              <tr className="tablerow">
                <td>{dataitem.ROLL_NO}</td>
                <td>{dataitem.NAME}</td>
                <td>{dataitem.TOPIC_NAME}</td>
                <td>{dataitem.MID_1}</td>
                <td>{dataitem.MID_2}</td>
                <td>
                  <i
                    class="fa fa-download"
                    aria-hidden="true"
                    style={{ color: "rgba(11, 91, 138, 1)" }}
                  ></i>
                </td>
              </tr>
            ))}
        </table>
        <div className="LOF_buttons">
          <Button
            icon={<i class="fas fa-file-export"></i>}
            children="EXPORT"
            className="normal"
            width="150"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissions;
