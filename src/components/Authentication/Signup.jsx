import React, { useState } from "react";
import { X } from "lucide-react";

const Signup = ({ onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup Successful:', data);
        onClose(); // Close the signup modal on success
      } else {
        const errMsg = await response.text();
        setError(errMsg || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Something went wrong. Please try again.');
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
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-white bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Signup Button */}
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
          <a href="#" onClick={onClose} className="text-cyan-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
