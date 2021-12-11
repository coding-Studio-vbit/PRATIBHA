import React from "react";
import Button from "../global_ui/buttons/button";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import "./loginPage.css";

export default function LoginPage() {

  const validateMail = (mail) => {
 
    if (/@vbithyd.ac.in\s*$/.test(mail)) {
      console.log("it ends in @vbithyd.ac.in")
  
    } else if (/@gmail.com\s*$/.test(mail)) {
      console.log("it ends in @gmail");
    }
  };

  const SignInWithFirebase = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user.email);
        validateMail(result.user.email);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="loginPage">
      <div className="logos">
        <img className="image" src="/Abhyas.jpeg" />
      </div>
      <div className="row">

      <div className="student">

      <i className="fas fa-user-circle icons"></i>
      <Button className="studentButton" onClick={SignInWithFirebase}>
        Login as Student
      </Button>
      </div>
      <div className="faculty">

      <i className="fas fa-graduation-cap icons "></i>

    
      <Button className="facultyButton" onClick={SignInWithFirebase}>
        Login as Faculty
      </Button>
      </div>
      </div>
    </div>
  );
}
