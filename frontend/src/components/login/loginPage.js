import React, { useState, useContext } from "react";
import Button from "../global_ui/buttons/button";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../context/AuthContext";

import "./loginPage.css";

export default function LoginPage() {
  const { user, dispatch } = useContext(AuthContext);

  let User = {};

  const validateMail = (result) => {
    if (/@vbithyd.ac.in\s*$/.test(result.user.email)) {
      console.log("it ends in @vbithyd.ac.in");

      if (/^[1-9]/.test(result.user.email)) {
        User = {
          email: result.user.email,
          name: result.user.displayName,
          role: ["student"],
          rollno: result.user.email.substr(0, 10),
        };
        console.log("it starts with num");
      } else {
        User = {
          email: result.user.email,
          name: result.user.displayName,
          role: ["faculty"],
        };
      }
    } else if (/@gmail.com\s*$/.test(result.user.email)) {
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
        validateMail(result);

        dispatch({
          type: "LOGIN",
          payload: User,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(user);

  return (
    <div className="loginPage">
      <div className="logos">
      {/* put 3 logos here  */}
        <img alt="loading" className="image" src="/Abhyas.jpeg" />
      </div>

      <div className="row">
        <div className="button-and-icon">
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
        <div className="button-and-icon">
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
  );
}
