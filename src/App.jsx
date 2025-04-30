import React, { useState, useEffect } from 'react';
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
// import Callwindow from './components/Callwindow/Callwindow';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);


  useEffect(() => {
    // Fetch message from Spring Boot backend
    fetch('http://localhost:8080/api/hello')
      .then(response => response.text())
      .then(data => setBackendMessage(data))
      .catch(error => console.error('Error fetching backend message:', error));
  }, []);

  return (
    <Router>
      <div className='w-full min-h-screen bg-[#111] relative overflow-x-hidden'>
        <Header 
            onLoginClick={() => setShowLogin(true)} 
            onSignupClick={() => setShowSignup(true)} 
            isLoggedIn={isLoggedIn}
            onLogout={() => setIsLoggedIn(false)} 
            />

        {/* Show backend message */}
        {backendMessage && (
          <div className="text-center text-white bg-green-600 p-2">
            {backendMessage}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                <About />
                <SecuritySection />
                <Working />
                <Footer />
              </>
            }
          />
          
          <Route path="/contacts" element={<Contact />} />        
        </Routes>

        {/* Modals */}
        {showLogin && (
          <Loginpage
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            onLoginSuccess={() => setIsLoggedIn(true)}
          />
        )}
        {showSignup && <Signup onClose={() => setShowSignup(false)} onLoginClick={() => setShowLogin(true)} />}
      </div>
    </Router>
  );
}

export default App;
