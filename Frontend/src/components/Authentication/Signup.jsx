import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";


const SuccessPopup = ({ onLogin, username }) => (
  <div className="fixed inset-0 z-30 bg-black bg-opacity-60 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold text-green-600 mb-2">Registration Successful!</h2>
      <p className="text-gray-700 mb-2">Please log in to start calling.</p>
      <p className="mb-2">Note down your userID before Login:</p>
      <p className="text-blue-600 font-mono font-semibold mb-4">{username}</p>
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let username = '';
  for (let i = 0; i < 7; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return username;
};

const Signup = ({ onClose, onLoginClick }) => {

  const [userID, setUserID] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUniqueUsername = async () => {
    let unique = false;
    let newUsername = '';
 
    while (!unique) {
      newUsername = generateUsername();
      try {
        const res = await axios.get(`http://localhost:8080/api/users/check-username/${newUsername}`);
 
        // Assuming your backend returns { available: true } if it's unique
        if (res.data.available) {
          unique = true;
        }
      } catch (err) {
        console.error("Username check failed:", err.message);
        break;
      }
    }
 
    return newUsername;
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const username = await getUniqueUsername();
      const response = await axios.post('http://localhost:8080/api/users/register', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        username: username
      });

      setUserID(username); 

      console.log('Signup Success:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Signup Error:', error);
      // alert('Signup failed! Please try again.');
      setServerError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-zinc-800 shadow-xl rounded-lg w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-700 font-['Playwrite_IN']">Connexus</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            <X size={22} />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-[#1B9AAA] text-white py-2 rounded-md ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-700 hover:shadow-lg shadow-cyan-700'} transition`}
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

          {serverError && <p className="text-red-400 text-sm mt-2 text-center">{serverError}</p>}
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
          username={userID}
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
