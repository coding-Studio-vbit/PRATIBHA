import React, { useEffect, useState } from "react";
import Navbar from "../../../global_ui/navbar/navbar";
import Card from "../../../global_ui/card/card.js";
import "./classList.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getSubjects } from "../../services/facultyServices";
import { useAuth } from "../../../context/AuthContext";
import { LoadingScreen } from "../../../global_ui/spinner/spinner";

const ClassList = () => {
  const location = useLocation();
  const {currentUser} = useAuth()
  const [subs,setSubs] = useState()
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchSubjects = async ()=>{

     const res = await getSubjects('cse@vbithyd.ac.in')
     console.log(res);
      if(res === -1){
        //display error
      }else{
        setSubs(res)
        setLoading(false)

      }
    }
    fetchSubjects()

  },[])

  // const BTechClasses = [
  //   "2_CSM_B_Software Engineering",
  //   "3_CSB_A_Compiler Design",
  //   "2_CE_A_Engineering Mechanics",
  // ];
  // const MBAClasses = ["2_Engineering Mechanics"];
  // const MTechClasses = [
  //   "2_CE_A_Engineering Mechanics",
  //   "1_CSE_A_Engineering Mechanics",
  // ];

  function handleCard(sub){
    console.log(sub);
      navigate('/faculty/studentlist',{state:sub})
  }

  return loading? <LoadingScreen/>: (
    <div
      style={{
        width: "100vw",
      }}
    >
      <Navbar title="Your Classes" logout={true} />
      <div className="div-container-classes">
        {subs.btechSubs.length !== 0 && (
          <div>
            <h4> B.Tech</h4>
            <div className="card-flex">
              {subs.btechSubs.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {subs.mtechSubs.length !== 0 && (
          <div>
            <h4> M.Tech</h4>
            <div className="card-flex">
              {subs.mtechSubs.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
                  />
                );
              })}
            </div>
          </div>
        )}
        {subs.mbaSubs.length !== 0 && (
          <div>
            <h4>MBA</h4>
            <div className="card-flex">
              {subs.mbaSubs.map((item) => {
                return (
                  <Card
                    classname="card-container"
                    onclick={handleCard}
                    text={item}
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
