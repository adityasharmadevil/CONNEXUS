import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const SuccessPopup = ({ onLogin }) => (
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


const generateUsername = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';         //username (10 digit alphanumeric value)
  let username = '';
  for (let i = 0; i < 6; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const digits = Math.floor(1000 + Math.random() * 9000); 
  return username + digits;
};

const Signup = ({ onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Ensure unique username by checking with backend
  const getUniqueUsername = async () => {
    let unique = false;
    let newUsername = '';

    while (!unique) {
      newUsername = generateUsername();
      try {
        const res = await axios.get(`http://localhost:8080/api/users/check-username/${newUsername}`);
        if (res.data.available) {
          unique = true;
        }
      } catch (err) {
        console.error("Username check failed", err);
        break; // fallback to stop loop on error
      }
    }

    return newUsername;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const username = await getUniqueUsername();
      const response = await axios.post('http://localhost:8080/api/users/register', {
        fullName: formData.fullName,
        email: formData.email,
        username,
        password: formData.password,
      });

      console.log('Signup Success:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Signup failed! Please try again.');
    } finally {
      setLoading(false);
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

        <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#1B9AAA] text-white py-2 rounded-md hover:bg-cyan-700 hover:shadow-lg shadow-cyan-700 transition"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : null}
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onLoginClick();
            }}
            className="text-cyan-600 hover:underline"
          >
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
