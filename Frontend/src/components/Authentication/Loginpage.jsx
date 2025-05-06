import React, { useState } from 'react';
import { X } from "lucide-react";
import axios from "axios";

function Loginpage({ onClose, onSignupClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',  // Masked field for either username or email input
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(password);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hash password before sending
      const hashedPassword = await hashPassword(formData.password);

      // Prepare payload (sending only username for backend)
      const payload = {
        username: formData.usernameOrEmail,  // We send usernameOrEmail (masked field)
        password: hashedPassword,
      };

      const response = await axios.post('http://localhost:8080/api/users/login', payload);

      console.log('Login Success:', response.data);
      alert('Login successful!');
  
      localStorage.setItem('username', formData.usernameOrEmail);

      onClose();
      onLoginSuccess();

    } catch (error) {
      const message = error?.response?.data || "Login failed! Please try again.";
      console.error('Login Error:', message);
      alert(message);
    }
  };
  
  return (
    <div className='fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center'>
      <div className="loginform p-6 bg-zinc-800 rounded-lg relative w-[90%] max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-white text-2xl font-bold mb-4 text-center font-['Playwrite_IN']">Connexus</div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            className='w-full p-3 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500'
            type="text"
            name="usernameOrEmail"  // The input field can handle both username and email
            placeholder='Username or Email'
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
          <input
            className='w-full p-3 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500'
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
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
