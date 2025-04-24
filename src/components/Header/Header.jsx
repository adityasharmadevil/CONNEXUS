import { useEffect, useState } from "react";
import React from 'react';

function Header({ onLoginClick, onSignupClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const landingHeight = window.innerHeight;
      setScrolled(offset >= landingHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed z-[1] w-full py-[2vw] px-[3vw] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#1B9AAA] shadow-md text-black" : "bg-transparent text-white"}`}>
      <div className="logo">
        <h1 className='text-white font-semibold text-[2vw]'>Connexus</h1>
      </div>
      <div className="authentication font-[Poppins]">
        <button className='login text-white bg-none mr-6' onClick={onLoginClick}>Login</button>
        <button className={`signup py-2 px-2 text-[#1B9AAA] border-2 rounded-md transition-all duration-300 ${scrolled ? "bg-[#1B9AAA] text-white border-white hover:bg-[#188795] hover:border-[#188795]" : "bg-[#1B9AAA] text-white border-[#1B9AAA] hover:bg-[#188795] hover:border-[#188795] hover:shadow-lg shadow-[#1B9AAA]"}`} onClick={onSignupClick}>Sign up</button>
      </div>
    </div>
  );
}

export default Header;
