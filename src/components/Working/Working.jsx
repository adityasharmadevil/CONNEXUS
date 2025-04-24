import React from 'react'
import './Working.css'

function Working() {
  return (
    <div className='working'> 
        <div className="heading">
            <h1 className='font-["New_Amsterdam"] text-7xl text-center'>How it Works</h1>
        </div>
        <div className='list-section px-40'>
            <ul className='font-[Poppins] text-3xl'>
                <li>Step 1: Sign Up & Log In</li>
                <li>Step 2: Add or Invite Contacts</li>
                <li>Step 3: Start a Secure Audio/Video Call</li>
                <li>Step 4: Enjoy Private, Encrypted P2P Communication</li>
            </ul>
        </div>
    </div>
  )
}

export default Working
