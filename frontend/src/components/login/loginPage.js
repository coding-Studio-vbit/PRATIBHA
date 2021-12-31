import React, { useEffect } from "react";
import "./loginPage.css";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../global_ui/spinner/spinner";
// import { createSubCollection } from "../faculty/services/facultyServices";



export default function LoginPage() {
  const { signInWithGoogle, currentUser, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (currentUser) {
      

      
      if (currentUser.userType === "STUDENT") {
        if (currentUser.isFirstTime) {
          nav("/student/enroll", { replace: true });

        } else {
          nav("/student/subjectslist", { replace: true });

        }
      } else if (currentUser.userType === "FACULTY") {
        if (currentUser.isFirstTime) {
          nav("/faculty/enroll", { replace: true });
        }else if(currentUser.isHOD){
          nav("/faculty/hodclasslist", { replace: true });

        }else if(currentUser.isCOE){
          nav("/faculty/coesearch", { replace: true });
          
        } else {
          nav("/faculty/classlist", { replace: true });
        }
      }else {
        //COE
        nav("/coesearch", { replace: true });
        
      }
    }
    
  
  }, [currentUser, nav]);

  return loading === false ? (
    <div className="loginPage">
      {/* <button onClick={createSubCollection}>Sub Collection</button> */}

     
      
      <div className="logos">
        <img alt="abhyas" className="abhyas" src="/abhyasLogo.jpg" />
        <img alt="loading" className="vbit" src="/vbit.png" />
        <img alt="loading" className="cs_logo" src="/cs_logo.png" />
      </div>

      {/* <p>{JSON.stringify(currentUser)}</p> */}


      <div className="row">
        <div className="button-and-icon">
          <i className="fas fa-user-circle icons"></i>
          <button className="loginBtn" onClick={signInWithGoogle}>
            Login as Student
          </button>
        </div>
        <div className="button-and-icon">
          <i className="fas fa-graduation-cap icons "></i>

          <button className="loginBtn" onClick={signInWithGoogle}>
            Login as Faculty
          </button>
        </div>
      </div>
    </div>
  ) : (
    <LoadingScreen />
  );
}

// const validateMail = (result) => {
//   if (/@vbithyd.ac.in\s*$/.test(result.user.email)) {
//     console.log("it ends in @vbithyd.ac.in");

//     if (/^[1-9]/.test(result.user.email)) {
//       User = {
//         email: result.user.email,
//         name: result.user.displayName,
//         role: ["student"],
//         rollno: result.user.email.substr(0, 10),
//       };
//       console.log("it starts with num");
//     } else {
//       User = {
//         email: result.user.email,
//         name: result.user.displayName,
//         role: ["faculty"],
//       };
//     }
//   } else if (/@gmail.com\s*$/.test(result.user.email)) {
//     console.log("it ends in @gmail");
//   }
// };
