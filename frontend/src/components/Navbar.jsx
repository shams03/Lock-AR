import React,  { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
    };
    
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className='bg-purple-900 text-white '>
        <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
            <img src='/logo2.png' width={100} />
            <ul className='flex gap-4'>
            <li><Link to="/" className="hover:font-bold">Home</Link></li>
          {isLoggedIn ? (
            <>
              <li><button onClick={handleLogout} className="hover:font-bold">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:font-bold">Login</Link></li>
              <li><Link to="/signup" className="hover:font-bold">Sign Up</Link></li>
            </>
          )}
          </ul>
          </div>
    </nav>
  )
}

export default Navbar

