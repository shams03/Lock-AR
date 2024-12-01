

import  { useRef, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = (props) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const passwordRef = useRef();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username: form.username,
        password: form.password,
      },
    );
     
      if (response.status === 200) {
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('username', form.username); 
        console.log(response.data.token)
        navigate('/manager');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Login failed: Invalid credentials',error.response);
      } else {
        alert('An error occurred during login');
      }
    }
  };

  const  toggleLogin=props.toggleLogin;
 useEffect(()=>{
  toggleLogin(false);
   },[])

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="flex justify-center items-center min-h-screen bg-purple-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-900">
           <span className='text-purple-700'>&lt;</span>
             Login
            <span className='text-purple-700'>/&gt;</span>
           </h2>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={form.username} 
            onChange={handleChange} 
            className="w-full mb-4 p-2 border rounded"
          />
          <div className="relative">
            <input 
              ref={passwordRef}
              type={showPass ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={form.password} 
              onChange={handleChange} 
              className="w-full mb-4 p-2 border rounded pr-10"
            />
            <span className="absolute right-[13px] top-[11px] cursor-pointer" onClick={() => setShowPass((prev) => !prev)}>
            {showPass ? (
                <FaRegEyeSlash className="size-5" />
              ) : 
                <FaRegEye className="size-5" />
            }
            </span>
          </div>
          <button type="submit" className="w-full p-2 bg-purple-700 text-white rounded">Login</button>
          <button className="w-1/2 p-2 bg-purple-700  text-white rounded " onClick={()=>{navigate("/forgotPassword")}}> Forgot Password </button>
        </form>
      
      </div>
    </>
  );
};

export default Login;
