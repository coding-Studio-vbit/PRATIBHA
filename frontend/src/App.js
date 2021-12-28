import React, { useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { LoadingScreen } from "./components/global_ui/spinner/spinner";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<LoginPage />} />

            
            <Route
              path="/student/*"
              element={
                <PrivateRoutes>
                  <Routes>
                    <Route exact path="/enroll" element={<EnrollClasses />} />
                    <Route path="/subjectslist" element={<SubjectsList />} />
                    <Route path="/uploadPRA" element={<Upload />} />
                  </Routes>
                </PrivateRoutes>
              }
            />
            <Route
              path="/faculty/*"
              element={
                <PrivateRoutes>
                  <Routes>
                    <Route exact path="/coesearch" element={<CoeSearch />} />
                    <Route exact path="/createPra" element={<CreatePra />} />
                    <Route
              exact
              path="/viewsubmissions"
              element={<ViewSubmissions/>}
            />
                    <Route exact path="/enroll" element={<LockList />} />
                    <Route path="/classlist" element={<ClassList />} />
                    <Route path="/hodclasslist" element={<HODClassList />} />
                    <Route path="/studentlist" element={<ListofStudents />} />
                    <Route path="/grading" element={<Grading />} />
                  </Routes>
                </PrivateRoutes>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

const PrivateRoutes = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem("url", location.pathname);
    sessionStorage.setItem("state", JSON.stringify(location.state));
  }, [location]);
  return loading ? (
    <LoadingScreen></LoadingScreen>
  ) : currentUser ? (
    children
  ) : (
    <Navigate to={"/"}></Navigate>
  );
};

export default App;
