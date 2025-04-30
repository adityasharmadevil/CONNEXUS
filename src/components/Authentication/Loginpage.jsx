import React, { useState } from 'react';
import { X } from "lucide-react";
import axios from "axios";

function Loginpage({ onClose, onSignupClick }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username: formData.usernameOrEmail, // assuming backend expects username
        password: formData.password,
      });

      console.log('Login Success:', response.data);
      alert('Login successful!');
      onClose();
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed! Please check your username and password.');
    }
  };

  return (
    <div className='fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center'>
      <div className="loginform p-6 bg-zinc-800 rounded-lg relative w-[90%] max-w-md">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="text-white text-2xl font-bold mb-4 text-center font-['Playwrite_IN']">Connexus</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            className='w-full p-3 text-white bg-zinc-700 rounded-md'
            type="text"
            name="usernameOrEmail"
            placeholder='Username or Email'
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <input
            className='w-full p-3 text-white bg-zinc-700 rounded-md'
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />

          <div className='text-sm text-right text-white'>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className='mt-2 w-full py-3 bg-[#1B9AAA] text-white rounded-md hover:bg-cyan-700 hover:shadow-lg shadow-cyan-700'
          >
            Login
          </button>
        </form>

        <p className='text-center text-sm text-white mt-4'>
          Don’t have an account?{' '}
          <button onClick={onSignupClick} className="text-[#1B9AAA] underline">Sign up</button>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
