import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Manager from "./components/Manager";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <div className={" h-full w-full"}>
      <Navbar isLoggedIn={isLoggedIn} toggleLogin={toggleLogin} />
      <div className="relative min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home toggleLogin={toggleLogin} />} />
          <Route path="/login" element={<Login toggleLogin={toggleLogin} />} />
          <Route
            path="/signup"
            element={<SignUp toggleLogin={toggleLogin} />}
          />
          <Route
            path="/manager"
            element={<Manager toggleLogin={toggleLogin} />}
          />
          <Route
            path="/forgotPassword"
            element={<ForgotPassword toggleLogin={toggleLogin} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
