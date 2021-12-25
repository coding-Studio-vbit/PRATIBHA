import React from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import Card from "../../../global_ui/card/card.js";
import "./classList.css";

const ClassList = () => {

  const Deadlines = [{class:'2_CSM_B_Software Engineering', mid1:'22-3-21', mid2:''},
                     {class:'2_CE_A_Engineering Mechanics', mid1:'22-3-21', mid2:''},
                     {class:'2_Engineering Mechanics', mid1:'22-3-21', mid2:''}];
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
            <h4> B.Tech</h4>
            <div className="card-flex">
              {BTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MTechClasses.length !== 0 && (
          <div>
            <h4> M.Tech</h4>
            <div className="card-flex">
              {MTechClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
                  />
                );
              })}
            </div>
          </div>
        )}
        {MBAClasses.length !== 0 && (
          <div>
            <h4>MBA</h4>
            <div className="card-flex">
              {MBAClasses.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                    subtext={Deadlines.map((pra) => {
                      return (
                        pra.class===item?pra.mid2===''?'PRA 1 Deadline: '+pra.mid1:'PRA 2 Deadline: '+pra.mid2:false
                      )
                    })}
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
