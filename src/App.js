import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import Post from "./components/Card";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginPage setUser={setUser} onAuthentication={handleAuthentication} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={<Post user={user} setuser={setUser} isAuthenticated={isAuthenticated} />}
          />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}
