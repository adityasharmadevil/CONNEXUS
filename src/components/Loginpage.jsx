import React from 'react'

function Loginpage() {
  return (
    <div className='h-screen w-full relative z-10 flex items-center justify-center'>
        <div className="loginform p-2 bg-amber-50 rounded-lg flex flex-col items-center bg-zinc-800 ">
            <div className="head">
                <div className="logo"><h1 className='text-white  font-["New_Amsterdam"]'>Connexus</h1></div>
                <div className="cancel"></div>
            </div>
            <div className="inputs w-full flex flex-col items-center ">
                <input className='w-full p-2 my-2 text-white bg-zinc-700 rounded-md ' type="text" placeholder='username or email' required="required"/>
                <input className='w-full p-2 my-2 text-white bg-zinc-700 rounded-md ' type="text" placeholder='password' />
            </div>
            <div className='w-full px-2 text-white'><a href="/">Forget password?</a></div>
            <button className='m-2 p-2 w-full border-2 border-[#1B9AAA] rounded-lg text-[#1B9AAA]'>Login</button>
            <div className='w-full px-2 text-white'>Don't have an account? <a className='text-[#1B9AAA]' href="/">Sign Up</a></div>
        </div>
    </div>
  )
}

export default Loginpage