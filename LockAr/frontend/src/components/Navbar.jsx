import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ isLoggedIn, toggleLogin }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("token from navbar : ", token);
      if (token == null) {
        toggleLogin(false);
        return;
      }
      const response = await fetch("http://localhost:3000/api/auth/status", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: token },
      });
      const data = await response.json();
      toggleLogin(data.isLoggedIn);
      console.log(data.isLoggedIn);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toggleLogin(false);
    navigate("/");
  };

  return (
    <nav className="bg-purple-900 text-white ">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
        <img src="/logo2.png" width={100} />
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="hover:font-bold">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={handleLogout} className="hover:font-bold">
                  Logout{isLoggedIn}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:font-bold">
                  Login{isLoggedIn}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:font-bold">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  toggleLogin: PropTypes.func.isRequired,
};

export default Navbar;
