import React, { useState, useEffect } from 'react';
import './Contact.css';
import { useNavigate, Link } from 'react-router-dom';
// import sideimg from './assets/image.png'

function Contact({ onLogout }) {
  const [recentCalls, setRecentCalls] = useState([]);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ✅ State to hold username from localStorage
  const [username, setUsername] = useState('');

  // ✅ Load username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleCallEnd = (user) => {
    setRecentCalls(prev => [
      { ...user, status: 'Offline', time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  useEffect(() => {
    const callEnded = localStorage.getItem('callEnded');
    const user = localStorage.getItem('lastCallUser');

    if (callEnded === 'true' && user) {
      handleCallEnd(JSON.parse(user));
      localStorage.removeItem('callEnded');
      localStorage.removeItem('lastCallUser');
    }
  }, []);

  const mockUsers = [
    { username: 'JOHN1234', fullName: 'John Doe', email: 'john@example.com' },
    { username: 'alice5678', fullName: 'Alice Smith', email: 'alice@example.com' },
    { username: 'bob4321', fullName: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const trimmed = searchTerm.trim().toUpperCase();

    if (!trimmed) {
      setError('Please enter a user ID.');
      setSearchedUser(null);
      return;
    }

    const user = mockUsers.find(user => user.username === trimmed);
    if (user) {
      setSearchedUser(user);
      setError('');
      navigate('/callwindow', { state: { user } });
    } else {
      setSearchedUser(null);
      setError('User not found!');
    }
  };

  return (
    <div className='mainpage'>
      <div className="navbar w-full py-[2vw] px-[3vw] flex justify-between items-center">
        <h1 className="logo font-['Playwrite_IN'] font-semibold text-[2vw]">Connexus</h1>

        <div className="flex items-center space-x-6 font-[Poppins]">
          {/* ✅ Display Username if available */}
          {username && (
            <span className="text-white text-lg">Hi, <span className="font-semibold text-cyan-400">{username}</span></span>
          )}

          <div
            className="relative"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button className="transition text-xl text-white">Profile</button>
            {showProfileMenu && (
              <div className="absolute top-5 right-0 mt-2 w-40 bg-white text-black rounded shadow-lg py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#1B9AAA]">My Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#1B9AAA]">Settings</Link>
                <button
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left hover:text-red-600"
                  onClick={() => {
                    onLogout();
                    localStorage.removeItem('username'); // ✅ Optional: Clear username on logout
                    setShowProfileMenu(false);
                    navigate('/');
                  }}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your JSX remains unchanged */}
      ...
    </div>
  );
}

export default Contact;
