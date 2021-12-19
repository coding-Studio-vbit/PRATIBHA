import React, { useState } from "react";
import Navbar from "../../../global_ui/navbar/navbar.js";
import "./createPra.css";
import Button from "../../../global_ui/buttons/button.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatePra = () => {
  const [date, setDate] = useState(new Date());

function handleCreate(){
   //store deadline and instructions in subjects collection
  console.log(date);
}

  return (
    <div style={{
        width:'100vw',
    }} >
      <Navbar title="Create PRA" />
      <div className="div-container">
       <span className="text-style">Enter instructions (if any):</span>
        <textarea rows={8} className="span-style" onChange={() => {}}></textarea>
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
            
            icon={<i class="fas fa-plus"></i>}
            onClick={handleCreate}
            children={"Create"}
          />
      </div>
    </div>
  );
};

export default CreatePra;
