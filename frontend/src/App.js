import React from "react";
import "./App.css";
import { AuthProvider } from "./components/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/loginPage";
import Home from "./components/home/home";
import ListofStudents from "./components/faculty/generalFaculty/ListOfStudents/ListOfStudents";
// import PrivateRoute from "./components/context/privateRoute";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/"  element={ <LoginPage/> }/>
            <Route exact path="/home" element={  <Home/> }/>
            <Route exact path="/list" element={ <ListofStudents/> }/>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;