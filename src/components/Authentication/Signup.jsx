import React from "react";
import { X } from "lucide-react"; // You can replace this with plain '×' if preferred

const Signup = ({ onClose }) => {
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
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 text-white bg-zinc-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
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
          <a href="#" onClick={onClose} className="text-cyan-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
