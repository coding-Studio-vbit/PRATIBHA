import React from "react";
import "./App.css";
import {BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import LoginPage from "./components/login/loginPage";
import StudentEnroll from "./components/student/enrollClass/enroll"
import LockList from "./components/faculty/common/LockListSubjects/lockList";
import ClassList from "./components/faculty/generalFaculty/ClassList/classlist";
import HODClassList from "./components/faculty/hod/classListHod";
import ListofStudents from "./components/faculty/generalFaculty/ListOfStudents/ListOfStudents";
import SubjectsList from "./components/student/SubjectsList/SubjectsList"
import CoeSearch from "./components/faculty/coe/coeSearch";
const App = () => {
  return(
  <Router>
  <div className="App">
  <Routes>
    <Route exact path="/" element={<LoginPage/>}/>
    <Route path="/studentenroll" element ={<StudentEnroll/>}/>
    <Route exact path="/locklist" element ={<LockList/>}/>
    <Route path ="/classlist" element={<ClassList/>}/>
    <Route path="/hodclasslist" element = {<HODClassList/>}/>
    <Route exact path="/listofstudents" element={<ListofStudents/>}/>
    <Route exact path="/subjectslist" element={<SubjectsList/>}/>
    <Route exact path ="/coesearch" element ={<CoeSearch/>}/>
     
  </Routes>
    
  </div>;
  </Router>
  )};

export default App;
