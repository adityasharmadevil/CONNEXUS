import React from 'react'
import './About.css'

function About() {
  return (
    <div className='about  h-screen w-full font-[Poppins] '>
        <div className="header1 text-[#1B9AAA]">
            <h1 className='text-[#1B9AAA] text-8xl font-["New_Amsterdam"] text-center'>About our Service</h1>
        </div>
        <p className='text-white p-28 text-3xl '>
        We provide a platform that allows users to connect directly through their browsers using WebRTC for audio and video calls. No app install, no server routing — just smooth, secure conversations.
        </p>


    </div>
  )
}

export default About
