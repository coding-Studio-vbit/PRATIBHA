import React from "react";
import "./App.css";
import { AuthProvider } from "./components/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/loginPage";
import Home from "./components/home/home";
import StudentEnroll from "./components/student/enrollClass/enroll";

// import PrivateRoute from "./components/context/privateRoute";

const App = () => {
  return (
    <div className="App">
     <AuthProvider>
        <Router>
          <Routes>
            
            <Route exact path="/" element={ <LoginPage/> }/>
            <Route path="/home" element={  <Home/> }/>
            <Route path="/dummy" element={ <Dummy/> }/>
            
          </Routes>
        </Router>
      </AuthProvider> 
    </div>
  );
};


function Dummy() {
  return (
    <div>
      <StudentEnroll/>      
    </div>
  )
}


export default App;