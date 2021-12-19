import React from "react";
import Button from "../global_ui/buttons/button";
import "./loginPage.css";
import { Navigate } from "react-router-dom";
import  useAuth  from "../context/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  return currentUser === null ? (
    <div className="loginPage">
      <div className="logos">
        {/* put 3 logos here  */}
        <img alt="loading" className="image" src="/Abhyas.jpeg" />
      </div>

      <p>{JSON.stringify(currentUser)}</p>

      <div className="row">
        <div className="button-and-icon">
          <i className="fas fa-user-circle icons"></i>
          <Button
            className="studentButton normal"
            onClick={signInWithGoogle}
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
            onClick={signInWithGoogle}
          >
            Login as Faculty
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/home" />
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
