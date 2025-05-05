import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';

function LandingPage({ onLoginClick }) {

  const navigate = useNavigate(); 
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleMakeCall = () => {
    if (isAuthenticated) {
      navigate('/contacts');
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className='content w-full h-[100vh] flex flex-col items-center justify-center bg-[url("src/assests/bgimage.jpg")]'>
      <div className="middle w-full py-5 flex flex-col justify-center items-center font-['New_Amsterdam'] leading-15">
        <h1 className='text-[#F8F9FA] text-[5vw]'>Connect Instantly,</h1>
        <h1 className='text-[#F8F9FA] text-[5vw]'>Talk <i className='text-[#1B9AAA]'>Securely</i> !</h1>
      </div>

      <div className='w-full py-2 flex justify-center'>
        <button
          className='h-[6vh] w-[15vw] rounded-lg bg-[#1B9AAA] font-[Poppins] hover:shadow-lg shadow-[#1B9AAA] hover:text-white'
          onClick={handleMakeCall}
        >
          Make a Call
        </button>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[80%] max-w-md">
            <p className="text-gray-800 text-lg font-medium mb-4">Please log in to make a call.</p>
            <button
              className="bg-[#1B9AAA] text-white px-4 py-2 rounded hover:bg-[#157f87]"
              onClick={() => {
                setShowLoginPrompt(false);
                onLoginClick(); 
              }}
            >
              Go to Login
            </button>
            <button
              className="ml-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;