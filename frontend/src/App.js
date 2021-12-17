import React from "react";
import "./App.css";
import { AuthProvider } from "./components/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/loginPage";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;