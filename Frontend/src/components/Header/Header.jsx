import { useEffect, useState } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Header({ onLoginClick, onSignupClick, isLoggedIn, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate(); 

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
    <div className={`fixed z-[1] w-full py-[2vw] px-[3vw] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#1B9AAA] shadow-md text-white" : "bg-transparent text-white"}`}>
      <div className="logo">
        <h1 className='font-semibold text-[2vw]'>Connexus</h1>
      </div>

      {!isLoggedIn ? (
        <div className="authentication font-[Poppins]">
          <button className='login text-white bg-none mr-6' onClick={onLoginClick}>Login</button>
          <button className={`signup py-2 px-2 text-[#1B9AAA] border-2 rounded-md transition-all duration-300 ${scrolled ? "bg-[#1B9AAA] text-white border-white hover:bg-[#188795] hover:bg-cyan-700" : "bg-[#1B9AAA] text-white border-[#1B9AAA] hover:bg-cyan-700 hover:border-cyan-700 hover:shadow-lg shadow-cyan-700"}`} onClick={onSignupClick}>Sign up</button>
        </div>
      ) : (
        <div className="navbar flex items-center gap-8 text-white font-[Poppins] relative">
          <Link 
              to="/" 
              className={`transition text-xl ${scrolled ? "hover:underline underline-offset-2" : "hover:text-[#1B9AAA]"}`}
            >
              Home
          </Link>
          <Link 
              to="/about" 
              className={`transition text-xl ${scrolled ? "hover:underline underline-offset-2" : "hover:text-[#1B9AAA]"}`}
            >
              About
          </Link>
          <Link 
              to="/working" 
              className={`transition text-xl ${scrolled ? "hover:underline underline-offset-2" : "hover:text-[#1B9AAA]"}`}
            >
              Working
          </Link>
          <div
            className="relative"  
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button className={`transition text-xl ${scrolled ? "hover:underline underline-offset-2" : "hover:text-[#1B9AAA]"}`}>Profile</button>
            {showProfileMenu && (
              <div className="absolute top-5 right-0 mt-2 w-40 bg-white text-black rounded shadow-lg py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button 
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    onLogout();         
                    setShowProfileMenu(false);  
                    navigate('/');    
                  }}
                  >Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
