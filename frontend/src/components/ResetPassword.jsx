import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaRegFaceRollingEyes } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCnfPass, setShowCnfPass] = useState(false);

  const handleChangeNewPassword = (e) => setNewPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      setMessage(data.message || "Password reset successful!");
    } catch (error) {
      setMessage("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-900">
          Reset Password
        </h2>
        <div className="relative"> 
          
          <input
            type={showPass ? "text" : "password"} 
            placeholder="New Password"
            value={newPassword}
            onChange={handleChangeNewPassword}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <span
            className="absolute right-[13px] top-[11px] cursor-pointer"
            onClick={() => setShowPass((prev) => !prev)}
          >
            {showPass ? (
              <FaRegEyeSlash className="size-5" />
            ) : (
              <FaRegEye className="size-5" />
            )}
          </span>
        </div>
        <div className="relative">
          <input
            type={showCnfPass ? "text" : "password"} 
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <span
            className="absolute right-[13px] top-[11px] cursor-pointer"
            onClick={() => setShowCnfPass((prev) => !prev)}
          >
            {showCnfPass ? (
              <FaRegEyeSlash className="size-5" />
            ) : (
              <FaRegEye className="size-5" />
            )}
          </span>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-purple-700 text-white rounded"
        >
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;