import React from 'react';
import { X } from "lucide-react";

function Loginpage({ onClose, onSignupClick }) {
  return (
    <div className='fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center'>
      <div className="loginform p-6 bg-zinc-800 rounded-lg relative w-[90%] max-w-md">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="text-white text-2xl font-bold mb-4 text-center font-['Playwrite_IN']  ">Connexus</div>

        {/* Inputs */}
        <div className="inputs w-full flex flex-col gap-4">
          <input className='w-full p-3 text-white bg-zinc-700 rounded-md' type="text" placeholder='Username or Email' />
          <input className='w-full p-3 text-white bg-zinc-700 rounded-md' type="password" placeholder='Password' />
        </div>

        <div className='text-sm text-right text-white mt-2'>
          <a href="#" className="hover:underline">Forgot password?</a>
        </div>

        <button className='mt-4 w-full py-3 bg-[#1B9AAA] text-white rounded-md'>Login</button>

        <p className='text-center text-sm text-white mt-4'>
          Don’t have an account? <button onClick={onSignupClick} className="text-[#1B9AAA] underline">Sign up</button>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
