import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import LandingPage from './components/LandingPage';
import About from './components/About/About';
import SecuritySection from './components/SecuritySection/SecuritySection';
import Working from './components/Working/Working';
import Footer from './components/Footer/Footer';
import Contact from './components/Contact/Contact';
import Loginpage from './components/Authentication/Loginpage';
import Signup from './components/Authentication/Signup';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      <div className='w-full min-h-screen bg-[#111] relative overflow-x-hidden'>
        <Header onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                <About />
                <SecuritySection />
                <Working />
                {/* <Contact /> */}
                <Footer />
              </>
            }
          />
        </Routes>

        {/* Modals */}
        {showLogin && <Loginpage onClose={() => setShowLogin(false)} onSignupClick={() => { setShowLogin(false); setShowSignup(true); }} />}
        {showSignup && <Signup onClose={() => setShowSignup(false)} />}
      </div>
    </Router>
  );
}

export default App;
