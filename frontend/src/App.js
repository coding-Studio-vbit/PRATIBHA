import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./components/login/loginPage";
import SubjectsList from "./components/student/SubjectsList/SubjectsList";
import Upload from "./components/student/uploadpra/uploadpra";
import LockList from "./components/faculty/common/LockListSubjects/lockList";
import ClassList from "./components/faculty/generalFaculty/ClassList/classList";
import Grading from "./components/faculty/common/grading";
import ListofStudents from "./components/faculty/generalFaculty/ListOfStudents/ListOfStudents";
import CoeSearch from "./components/faculty/coe/coeSearch";
import EnrollClasses from "./components/student/enrollClass/enrollClasses";
import ViewSubmissions from "./components/faculty/common/ViewSubmissions/ViewSubmissions";
import CreatePra from "./components/faculty/common/createPRA/createPra";
import HODClassList from "./components/faculty/hod/classListHod";
import AddClasses from "./components/faculty/common/LockListSubjects/addclasses";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </div>
  );
};
const AllRoutes = () => {
  const { currentUser } = useAuth();
  const studentVerified = currentUser && currentUser.userType==="STUDENT"
  const facultyVerified = currentUser && currentUser.userType ==='FACULTY'
  return (
    <Router>
      <Routes>
        {
          currentUser===null && <Route path='*' element = {<LoginPage/>}/>
        }
        <Route exact path="/" element={<LoginPage />} />
        
        {studentVerified && (
          <Route
            path="/student/*"
            element={
              <Routes>
                <Route exact path="/enroll" element={<EnrollClasses />} />
                <Route path="/subjectslist" element={<SubjectsList />} />
                <Route path="/uploadPRA" element={<Upload />} />
              </Routes>
            }
          />
        )}
        {facultyVerified && (
          <Route
          path="/faculty/*"
          element={
              <Routes>
                {currentUser.isCOE && (
                  <>
                    <Route exact path="/coesearch" element={<CoeSearch />} />
                  </>
                )}
                 {(currentUser.isCOE || currentUser.isHOD) && (
                  <Route
                      exact
                      path="/viewsubmissions"
                      element={<ViewSubmissions />}
                    />

                 )}   

                <Route exact path="/createPra" element={<CreatePra />} />

                <Route exact path="/enroll" element={<LockList />} />
                <Route exact path ="addclasses" element={<AddClasses/>}/>
                {!currentUser.isHOD && (
                  <Route path="/classlist" element={<ClassList />} />
                )}
                {currentUser.isHOD && (
                  <Route path="/hodclasslist" element={<HODClassList />} />
                )}
                <Route path="/studentlist" element={<ListofStudents />} />
                <Route path="/grading" element={<Grading />} />
              </Routes>
           
          }
        />
        )}
        
      </Routes>
    </Router>
  );
};
// const PrivateRoutes = ({ children }) => {
//   const { currentUser, loading } = useAuth();
//   const location = useLocation();

//   useEffect(() => {
//     // sessionStorage.setItem("url", location.pathname);
//     // sessionStorage.setItem("state", JSON.stringify(location.state));
//   }, [location]);
//   return loading ? (
//     <LoadingScreen></LoadingScreen>
//   ) : currentUser ? (
//     children
//   ) : (
//     <Navigate to={"/"}></Navigate>
//   );
// };

export default App;
