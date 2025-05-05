import React, { useState } from 'react';
import './Contact.css';
import { useNavigate } from 'react-router-dom'; 

function Contact() {

  const navigate = useNavigate();

  const mockUsers = [
    { username: 'JOHN1234', fullName: 'John Doe', email: 'john@example.com' },
    { username: 'alice5678', fullName: 'Alice Smith', email: 'alice@example.com' },
    { username: 'bob4321', fullName: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
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
      navigate('/callwindow', {state:{user}});
    } else {
      setSearchedUser(null);
      setError('User not found!');
    }
  };

  return (
    <div className='mainpage'>
      <div className="navbar w-full py-[2vw] px-[3vw]">
        <h1 className="logo font-['Playwrite_IN'] font-semibold text-[2vw]">Connexus</h1>
        <h1 className='text-[1.2vw]'>Profile</h1>
      </div>

      <div className="Call-display flex items-center">
        <div className="left flex flex-col items-center">
          <h1 className="text-xl mb-4">Search through userID</h1>
          <div className="searchbar">
            <input
              type="text"
              placeholder='Enter user ID'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded bg-zinc-800 text-white border border-gray-600"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#1B9AAA] text-white rounded hover:bg-[#178e8d]"
            >Call User</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          
        </div>

        <div className="right"></div>

      </div>
    </div>
  );
}

export default Contact;
