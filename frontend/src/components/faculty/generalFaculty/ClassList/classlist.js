import React from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import Card from "../../../global_ui/card/card.js";
import "./classList.css";

const ClassList = () => {
  const BTechClasses = [
    "2_CSM_B_Software Engineering",
    "3_CSB_A_Compiler Design",
    "2_CE_A_Engineering Mechanics",
  ];
  const MBAClasses = ["2_Engineering Mechanics"];
  const MTechClasses = [
    "2_CE_A_Engineering Mechanics",
    "1_CSE_A_Engineering Mechanics",
  ];

  function handleCard(){
      //
  }

  return (
    <div
      style={{
        width: "100vw",
      }}
    >
      <Navbar title="Your Classes" logout={true} />
      <div className="div-container-classes">
        {BTechClasses.length !== 0 && (
          <div>
            <p style={{textAlign:'center'}}> B.Tech</p>
            <div className="card-flex">
              {BTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item.replaceAll("_"," ")}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MTechClasses.length !== 0 && (
          <div>
            <p style={{textAlign:'center'}}> M.Tech</p>
            <div className="card-flex">
              {MTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item.replaceAll("_"," ")}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MBAClasses.length !== 0 && (
          <div>
            <p style={{textAlign:'center'}}>MBA</p>
            <div className="card-flex">
              {MBAClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item.replaceAll("_"," ")}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassList;
