import React, {useState, useContext} from "react";
import Button from "../global_ui/buttons/button";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../context/AuthContext";

import "./loginPage.css";

export default function LoginPage() {

  const {dispatch}  = useContext(AuthContext);
  const [isStudent, setIsStudent] = useState(false);

  const validateMail = (mail) => {
    if (/@vbithyd.ac.in\s*$/.test(mail)) {
      console.log("it ends in @vbithyd.ac.in");
      if (/^[0-9]/.test(mail)) {
        setIsStudent(true);
      }
    } else if (/@gmail.com\s*$/.test(mail)) {
      console.log("it ends in @gmail");
    }
  };

  const SignInWithFirebase = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user.email);
        console.log(result.user.displayName);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential, 9);
        validateMail(result.user.email);
        let user={};
        if (isStudent) {
           user = {
            email: result.user.email,
            name: result.user.displayName,
            role: ["student"],
            rollno: result.user.email.substr(0, 9),
          };
        } else {
           user = {
            email: result.user.email,
            name: result.user.displayName,
            role: ["faculty"],
          };
        }
        dispatch({
          type: "LOGIN",
          payload: user,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  return (
    <div className="loginPage">
      <div className="logos">
        <img alt="loading" className="image" src="/Abhyas.jpeg" />
      </div>
      <div className="row">
        <div className="student">
          <i className="fas fa-user-circle icons"></i>
          <Button
            className="studentButton normal"
            onClick={SignInWithFirebase}
            width="250"
            height="60"
          >
           
            Login as Student
          </Button>
        </div>
        <div className="faculty">
          <i className="fas fa-graduation-cap icons "></i>

          <Button
            className="facultyButton normal"
            width="250"
            height="60"
            onClick={SignInWithFirebase}
          >
            Login as Faculty
          </Button>
          
        </div>
      </div>
    </div>
  )
}
