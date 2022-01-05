import React, {useEffect, useState } from "react";
import Navbar from "../../../global_ui/navbar/navbar.js";
import "./createPra.css";
import Button from "../../../global_ui/buttons/button.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation,useNavigate } from "react-router-dom";
import { getPRA, setPRA } from "../../services/facultyServices.js";
import { useAuth } from "../../../context/AuthContext.js";
import Dialog from '../../../global_ui/dialog/dialog';
import { Timestamp } from "firebase/firestore";

const CreatePra = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [dialog,setdialog] = useState(null);
  const [inst, setInst] = useState("");
  const location = useLocation();
  
  const {currentUser} = useAuth()
  console.log(currentUser)
  console.log(currentUser.isMid2)
  useEffect(()=>{
    
    const fetchPRA = async ()=>{
      const parts = location.state.sub.split("_");
    const sub = parts[4];
    const department =
      parts[0] + "_" + parts[1] + "_" + parts[2] + "_" + parts[3];
      const res = await getPRA(sub,department)
      
      if(res.deadline2){
        
      setDate(new Timestamp(res.deadline2.seconds,res.deadline2.nanoseconds).toDate() )

      }else{

        setDate(new Timestamp(res.deadline1.seconds,res.deadline1.nanoseconds ).toDate())
      }
      setInst(res.instructions)
    }
    if(location.state.editPRA)
    fetchPRA()
  },[])
  async function handleCreate() {
    const parts = location.state.sub.split("_");
    const sub = parts[4];
    const department =
      parts[0] + "_" + parts[1] + "_" + parts[2] + "_" + parts[3];
    await setPRA(sub, department, date, inst,currentUser.email,currentUser.isMid1,currentUser.isMid2);
    setdialog('PRA created')
  }

  return (
    <div
      style={{
        width: "100vw",
      }}
    >
      <Navbar title={ location.state.editPRA?"Edit PRA": " Create PRA"} />
      {
                dialog && <Dialog message={dialog} onOK={()=>{navigate('/faculty/studentlist',{state:location.state},{replace:true})}}/>
            } 
      <div className="div-container">
        <span className="text-style">Enter instructions (if any):</span>
        <textarea
          rows={8}
          value={inst}
          className="span-style"
          onChange={(e) => setInst(e.target.value)}
        ></textarea>
        <span className="text-style2">
          Set PRA Deadline:
          <span>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={date}
              value={date}
              minDate={new Date()}
              onChange={(newVal) => {
                setDate(newVal);
              }}
              className="select-dd"
            />
          </span>
        </span>
        <Button
          className="create-button normal"
          icon={<i className="fas fa-plus"></i>}
          onClick={handleCreate}
          children={ location.state.editPRA?"Edit": "Create"}
        />
      </div>
    </div>
  );
};

export default CreatePra;
