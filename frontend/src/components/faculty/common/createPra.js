import React, { useState } from "react";
import Navbar from "../../global_ui/navbar/navbar.js";
import "./createPra.css";
import Button from "../../global_ui/buttons/button.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatePra = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{
        width:'100vw',
    }} >
      <Navbar title="CREATE NEW PRA" />
      <div className="div-container">
       <span className="text-style">Enter instructions (if any):</span>
        <textarea rows={8} className="span-style" onChange={() => {}}></textarea>
        <span className="text-style2">
          Set PRA Deadline:
          {console.log(date)}
          <span>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={date}
              value={date}
              onChange={(newVal) => {
                setDate(newVal);
              }}
              className="select-dd"
            />
          </span>
        </span>
          <Button
            className="normal"
            
            icon={<i class="fas fa-plus"></i>}
            onClick={() => {}}
            children={"Create"}
          />
      </div>
    </div>
  );
};

export default CreatePra;
