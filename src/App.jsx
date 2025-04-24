import React from 'react'
import Header from './components/Header/Header'
import LandingPage from './components/LandingPage'
import Loginpage from './components/loginpage'
import About from './components/About/About'
import SecuritySection from './components/SecuritySection/SecuritySection'
import Footer from './components/Footer/Footer'
import Working from './components/Working/Working'
import Contact from './components/Contact/Contact'


function App() {
  return (
    <div className='w-full min-h-screen bg-[#111]'>
      {/* <Header/>
      <LandingPage/>  */}
      {/* <Loginpage/> */}
    	{/* <About/>
      <SecuritySection/>
      <Working/>
      <Footer/> */}
      <Contact/>
    </div>
  )
}

export default App