import React from 'react'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import Loginpage from './components/loginpage'


function App() {
  return (
    <div className='w-full min-h-screen bg-[#111]'>
      <Header/>
      <LandingPage/> 
      <Loginpage/>

    </div>
  )
}

export default App