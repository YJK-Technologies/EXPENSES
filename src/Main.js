import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Login from "./Login.js";
//import Register from "./registration.js";
import Mainpage from './Navbar.js';
import Login from './component/log.js';
import Signup from './signup.js';
import ReportPage from "./ReportPage";
import Logout from './logout.js';
import App from './App.js';

function Main() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Expenses" element={<Mainpage />} />
        <Route path="/AddUserForm" element={<App />} />
        <Route path="/report" element={<ReportPage/>} />   
        <Route path="/logout" element={<Logout/>} />   
      </Routes>
    </Router>  
  )
}

export default Main