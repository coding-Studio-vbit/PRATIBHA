import React from "react";
import "./App.css";
import { AuthProvider } from "./components/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/loginPage";
import Home from "./components/home/home";
import Upload from "./components/student/uploadpra/uploadpra";
import Grading from "./components/faculty/common/grading";
// import PrivateRoute from "./components/context/privateRoute";

const App = () => {
  return (
    <div className="App">
     <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={ <LoginPage/> }/>
            <Route exact path="/dummy" element={ <Dummy/> }/>
            <Route exact path="/home" element={  <Home/> }/>
          </Routes>
        </Router>
      </AuthProvider> 
      <Grading/>
    </div>
  );
};


function Dummy() {
  return (
    <div>
      <Upload/>      
    </div>
  )
}


export default App;