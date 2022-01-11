import React, { useEffect } from "react";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import ContactPage from "./contactPage/contactPage";

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
        } else if (currentUser.isHOD) {
          nav("/faculty/hodclasslist", { replace: true });
        } else if (currentUser.isCOE) {
          nav("/faculty/coesearch", { replace: true });
        } else {
          nav("/faculty/classlist", { replace: true });
        }
      } else {
        //COE
        nav("/coesearch", { replace: true });
      }
    }
  }, [currentUser, nav]);

  return loading === false ? (
    <div className="page">
      <div className="loginComponent">
        
        <div className="logos">
          <div className="pratibha">
              <img alt="Pratibha" height={70} src="/pratibha.png"/>
              <span className="titleStyle" >PRATIBHA</span>
          </div>

         
            <img alt="abhyas" className="abhyas" src="/abhyasLogo.jpg" />
            <img alt="vbit" className="vbit" src="/vbit.png" />
         

          {/* <div>
            <img alt="codingStudio" className="cs_logo" src="/cs_logo.png" />
          </div>          */}
        </div>

        <div className="row">
          <div className="button-and-icon">
            <i className="fas fa-graduation-cap icons "></i>
            <button className="loginBtn" onClick={signInWithGoogle}>
              Login as Student
            </button>
          </div>
          <div className="button-and-icon">
            <i className="fas fa-user-circle icons"></i>

            <button className="loginBtn" onClick={signInWithGoogle}>
              Login as Faculty
            </button>
          </div>
        </div>        
      </div>

      <div className="pratibhaDescription">
          Pratibha
      </div>
      <ContactPage/>
    </div>
  ) : (
    <LoadingScreen />
  );
}
