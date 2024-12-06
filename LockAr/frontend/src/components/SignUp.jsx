/* eslint-disable react/prop-types */
import  { useRef, useState,useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash,  } from "react-icons/fa6";

const SignUp = (props) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const  toggleLogin=props.toggleLogin;
  useEffect(()=>{
   toggleLogin(false);
    },[])
  const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  const [showPass, setShowPass] = useState(false);
  const [showCnfPass, setShowCnfPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(form?.username.length <= 5){
      setError("Username length should be atleast 6");
      return;
    }
    if(form?.password.length<8){
      setError("Password length should be atleast 8");
      return;
    }
    if(!regex.test(form?.password)){
      setError("Password must contain both alphabets and numbers")
      return;
    }
    if (form?.password !== form?.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Sign-up failed");
      } else {
        // If error.response is undefined, it could be a network or server issue
        setError("An unexpected error occurred. Please try again later.");
        console.error("Error during sign-up:", error); // Log full error for debugging
      }
    }
  };

  

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-purple-200 opacity-50"></div>
      <div className="relative flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg w-80"
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-purple-900">
            <span className="text-purple-700">&lt;</span>
            Sign Up
            <span className="text-purple-700">/&gt;</span>
          </h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-purple-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-purple-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <div className="relative mb-4">
            <input
              ref={passwordRef}
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className=" p-3 border border-purple-600 rounded-full focus:outline-none focus:ring-5 focus:ring-purple-500 pr-10"
              required
            />
            <span
              className="absolute right-[15px] top-[15px]  cursor-pointer"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? (
                <FaRegEyeSlash className="size-5" />
              ) : (
                <FaRegEye className="size-5" />
              )}
            </span>
          </div>
          <div className="relative mb-4 w-full ">
            <input
              ref={confirmPasswordRef}
              type={showCnfPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className=" mr-10 py-52 p-3 border border-purple-600 rounded-full focus:outline-none focus:ring- focus:ring-purple-500"
              required
            />
        
            <span
              className="absolute right-[15px] top-[15px] ml-[-5vh] cursor-pointer "
              onClick={() => setShowCnfPass((prev) => !prev)}
            >
              {showCnfPass ? (
                <FaRegEyeSlash className="size-5 " />
              ) : (
                <FaRegEye className="size-5 " />
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition-colors duration-200"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center cursor-pointer text-purple-900" onClick={()=>navigate("/login")}>
            Already have an account?
              Log In
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
