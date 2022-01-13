import React, { useEffect } from "react";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen, Spinner } from "../global_ui/spinner/spinner";
import ContactPage from "./contactPage/contactPage";
import Footer from "./footer/footer";
import PratibhaInfo from "./pratibhaInfo/pratibhaInfo";

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
          <img alt="vbit" className="vbit" src="/vbit.png" />       
          <img alt="codingStudio" className="cs_logo" src="/cs_logo.png" />
        </div>

        <div className="row">
          <div className="button-and-icon">
          <i class="fas fa-user-graduate icons"></i>            
          <button className="loginBtn" onClick={signInWithGoogle}>
              Login as Student
            </button>
          </div>
          <div className="button-and-icon">
          <i className="fas fa-users icons"></i>

            <button className="loginBtn" onClick={signInWithGoogle}>
              Login as Faculty
            </button>
          </div>
        </div>        
      </div>
  
      {/* <PratibhaInfo/> */}

      <Footer/>
    </div>
  ) : (
    <LoadingScreen/>
  );
}
