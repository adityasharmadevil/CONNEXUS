import React from 'react'

function LandingPage() {
  return (
    <div className='content w-full h-[100vh] flex flex-col items-center justify-center bg-[url("src/assests/bgimage.jpg")]'>
        <div className="middle w-full py-5 flex flex-col justify-center items-center font-['New_Amsterdam'] leading-15">
            <h1 className='text-[#F8F9FA] text-[5vw]'>Connect Instantly,</h1> 
            <h1 className='text-[#F8F9FA] text-[5vw]'>Talk <i className='text-[#1B9AAA]'>Securely</i> !</h1>
        </div>
        <div className='w-full py-2 flex justify-center'>
          <button className='h-[6vh] w-[15vw] rounded-lg bg-[#1B9AAA] font-[Poppins] hover:shadow-lg shadow-[#1B9AAA] hover:text-white'>Make a Call </button>
        </div>
    </div>
  )
}

export default LandingPage