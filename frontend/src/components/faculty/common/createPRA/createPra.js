import React, { useEffect, useState } from "react";
import Navbar from "../../../global_ui/navbar/navbar.js";
import "./createPra.css";
import Button from "../../../global_ui/buttons/button.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPRA,
  setPRA,
  getCoeDeadline,
} from "../../services/facultyServices.js";
import { useAuth } from "../../../context/AuthContext.js";
import Dialog from "../../../global_ui/dialog/dialog";
import { Timestamp } from "firebase/firestore";
import {
  fetchisMid1,
  fetchisMid2,
} from "../../../student/services/studentServices.js";
import { Spinner } from "../../../global_ui/spinner/spinner.js";

const CreatePra = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date(new Date().setHours(23,59)));
  const [dialog, setdialog] = useState(""); 
  const [isNewPra, setisNewPra] = useState(true);
  const [Loading, setLoading] = useState(true);
  const [mid, setmid] = useState("");
  const [inst, setInst] = useState(""); 
  const location = useLocation();
  const [DeadLine, setDeadLine] = useState("");
  const { currentUser } = useAuth();
  
  

  const parts = location.state.sub.split("_");
  const course = parts[0];
  const year = parts[2];

  const sub = parts[5];
  const department =
    parts[0] + "_" + parts[1] + "_" + parts[2] + "_" + parts[3]+"_"+parts[4];

  let title = parts[0] + " " + parts[2] + " " + parts[3] + " " + parts[4];
  if (parts[3] === "Not Applicable") {
    title = parts[0] + " " + parts[2] + " " + parts[4];
  }

 
  const deadline = async () => {
    const isMid1 = await fetchisMid1(course, year);
    const isMid2 = await fetchisMid2(course, year);

    const midNumber = () => {
      if (isMid1) {
        setmid("1");
      } else if (isMid2) {
        setmid("2");
      }
    };
    midNumber();

    const coeDeadline = await getCoeDeadline(mid, course, year);
    try{
      if (coeDeadline) {
        setDeadLine(coeDeadline.data.seconds);
      } else {
        setDeadLine(false);
      }
    }catch{
      console.log(coeDeadline.error);
    }
    setLoading(false);
  };
  deadline();
  var CoeDate = new Date(DeadLine * 1000);
  useEffect(() => {
    const fetchPRA = async () => {
      const res = await getPRA(sub, department);
      if (res.deadline2) {
        setDate(
          new Timestamp(
            res.deadline2.seconds,
            res.deadline2.nanoseconds
          ).toDate()
        );
      } else {
        setDate(
          new Timestamp(
            res.deadline1.seconds,
            res.deadline1.nanoseconds
          ).toDate()
        );
      }
      setInst(res.instructions);
    };

    if (location.state.editPRA) {
      fetchPRA();
      setisNewPra(false);
    }
  }, []);
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };
  async function handleCreate() {
    setLoading(true);
    const isMid1 = await fetchisMid1(course, year);
    const isMid2 = await fetchisMid2(course, year);
    const parts = location.state.sub.split("_");
    const sub = parts[5];
    const department =
      parts[0] + "_" + parts[1] + "_" + parts[2] + "_" + parts[3]+"_"+parts[4];
    setdialog("PRA created");  
    await setPRA(
      sub,
      department,
      date,
      inst,
      //currentUser.email,
      isMid1,
      isMid2
    );
    setLoading(false);
  }

  return (
    <div
      style={{
        width: "100vw",
      }}
    >
      <Navbar
        backURL={
          isNewPra
            ? 
               "/faculty/classlist"
            : "/faculty/studentlist"
        }
        props={isNewPra ? false : { state: { sub: location.state.sub } }}
        title={title}
      />
      <p className="createPRAsub">Subject : {parts[5]}</p>
      {dialog && (
        <Dialog
          message={dialog}
          onOK={() => {
            navigate("/faculty/studentlist", {
              state: { sub: location.state.sub },
            });
          }}
        />
      )}

      {    Loading ? (
      <div className='createspinnerload'>
      <Spinner radius={1.5} />
      </div>
    ) : 
(
        <div className="div-container">
          <span className="text-style">Enter instructions (if any):</span>
          <textarea
            style={{ resize: "none" }}
            rows={8}
            value={inst}
            className="span-style"
            onChange={(e) => setInst(e.target.value)}
          ></textarea>
          <span className="coe-deadline">
            <span>CoE Deadline: </span>
            {CoeDate.toLocaleDateString("en-IN")}
          </span>
          <span className="text-style2">
            Set mid-{mid} PRA Deadline:
            <span className="date-time">
              <DatePicker
                dateFormat="dd/MM/yyyy h:mm aa"
                selected={date}
                value={date}
                minDate={new Date()}
                filterTime={filterPassedTime}
                excludeTimes={[
                  new Date( new Date().setHours(0,0,0,0))
                ]}
                showTimeSelect
                maxDate={CoeDate}
                onChange={(newVal) => {
                  setDate(newVal);
                }}
                className="select-dd"
              />
            </span>
          </span> 

          <Button
            style={{ padding: "5px" }}
            className="create-button normal"
            icon={
              location.state.editPRA ? false : <i className="fas fa-plus"></i>
            }
            onClick={handleCreate}
            children={location.state.editPRA ? "Done" : "Create"}
          />
        </div>
      )}
    </div>
  );
};

export default CreatePra;
