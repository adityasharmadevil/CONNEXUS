import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import LandingPage from './components/LandingPage';
import About from './components/About/About';
import SecuritySection from './components/SecuritySection/SecuritySection';
import Working from './components/Working/Working';
import Footer from './components/Footer/Footer';
import Contact from './components/Contact/Contact';
import Loginpage from './components/Authentication/Loginpage';
import Signup from './components/Authentication/Signup';
import CallWindow from './components/Callwindow/Callwindow';

// Wrapper to use useNavigate in functional App component
const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(response => response.text())
      .then(data => setBackendMessage(data))
      .catch(error => console.error('Error fetching backend message:', error));
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    navigate('/contacts'); // Redirect to Contact page
  };

  return (
    <div className='w-full min-h-screen bg-[#111] relative overflow-x-hidden'>
    {location.pathname !== '/contacts' && (
      <Header
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />
    )}
    

      {/* {backendMessage && (
        <div className="text-center text-white bg-green-600 p-2">
          {backendMessage}
        </div>
      )} */}

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
        <Route path="/callwindow" element={<CallWindow />} />
      </Routes>

      {/* Modals */}
      {showLogin && (
        <Loginpage
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onLoginClick={() => setShowLogin(true)}
        />
      )}
    </div>

    // <div>
    //   <CallWindow/>
    // </div>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
