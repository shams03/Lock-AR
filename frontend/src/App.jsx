// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Manager from './components/Manager';
import Navbar from './components/Navbar';
import Footer from './components/Fotter';
import ResetPassword from './components/ResetPassword';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <div className='min-h-[80vh]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login  />} /> {/* Fixed typo here */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route 
            path="/manager" 
            element={<Manager />}
            // element={isAuthenticated ? <Manager /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
