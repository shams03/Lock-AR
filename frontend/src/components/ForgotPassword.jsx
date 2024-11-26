import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot-password', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); 
      } else {
        setMessage(data.error); 
      }
    } catch (error) {
      setMessage('Something went wrong, please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-900">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-purple-700 text-white rounded">Send Reset Link</button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
