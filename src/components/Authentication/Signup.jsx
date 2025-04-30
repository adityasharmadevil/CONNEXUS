import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const SuccessPopup = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-green-600 mb-2">Registration Successful!</h2>
        <p className="text-gray-700 mb-4">Please log in to start calling.</p>
        <button
          onClick={onLogin}
          className="bg-[#1B9AAA] text-white px-4 py-2 rounded hover:bg-[#178e8d]"
        >
          Login
        </button>
      </div>
    </div>
  );
};


const Signup = ({ onClose, onLoginClick }) => {

  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      console.log('Signup Success:', response.data);
      // alert('Signup successful!, please login again');
      setShowSuccess(true); 
      onClose();
      onLoginClick();
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Signup failed! Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-zinc-800 shadow-xl rounded-lg w-full max-w-md p-8">

        {/* Top Row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-700 font-['Playwrite_IN']">Connexus</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            <X size={22} />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {/* <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          /> */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
             onClick={() => {
                onClose();       
                onLoginClick();  
              }}
              className="text-cyan-600 hover:underline">
              Log in
          </button>
        </p>
      </div>

      {showSuccess && (
  <SuccessPopup
    onLogin={() => {
      setShowSuccess(false);  
      onClose();              
      onLoginClick();         
    }}
  />
)}

    </div>
  );
};

export default Signup;
