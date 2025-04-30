import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bgimage.jpg';

function LandingPage() {
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);


  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleMakeCall = () => {
    if (isLoggedIn) {
      navigate('/contacts');
    } else {
      setShowLoginAlert(true);
    }
  };

  const closeAlert = () => {
    setShowLoginAlert(false);
  };

  return (
    <div className='content w-full h-[100vh] flex flex-col items-center justify-center '>
      <div className="middle w-full py-5 flex flex-col justify-center items-center font-['New_Amsterdam'] leading-15">
        <h1 className='text-[#F8F9FA] text-[5vw]'>Connect Instantly,</h1> 
        <h1 className='text-[#F8F9FA] text-[5vw]'>
          Talk <i className='text-[#1B9AAA]'>Securely</i> !
        </h1>
      </div>

      <div className='w-full py-2 flex justify-center'>
        <button
          className='h-[6vh] w-[15vw] rounded-lg bg-[#1B9AAA] font-[Poppins] hover:shadow-lg shadow-[#1B9AAA] hover:text-white'
          onClick={handleMakeCall}
        >
          Make a Call
        </button>
      </div>

     
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6 text-center">Please log in first to make a call.</p>
            <button
              onClick={closeAlert}
              className="bg-[#1B9AAA] text-white px-6 py-2 rounded-md hover:bg-[#178e90] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
