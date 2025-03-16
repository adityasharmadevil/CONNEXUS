import React from 'react'

function Header() {
  return (
    <div className='fixed z-[1] w-full py-[2vw] px-[3vw] flex items-center justify-between'>
        <div className="logo"><h1 className=' text-white font-semibold text-[2vw] '>Connexus</h1></div>
        <div className="authentication font-[Poppins]">
            <button className='login text-white bg-none mr-6'>Login</button>
            <button className='signup py-2 px-2 text-[#1B9AAA] border-2 rounded-md'>Sign up</button>
        </div> 
    </div>
  )
}

export default Header