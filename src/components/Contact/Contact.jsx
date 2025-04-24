// import React from 'react'
// import './Contact.css'

// function Contact() {
//   return (
//     <div className='contact'>
//         <div className="header">
//           <div id="logo">Connexus</div>
//         </div>
//         <h1>Make a call </h1>
//         <div className="contacts">
//           <div className="contact-list">
//             <h1>Contacts</h1>
//             <div className="searchbar"><input type="text" placeholder='Search contacts'/></div>
//             <div className="list">
//               <div className="user-contact">
//                 <div className="name"><h1>Name1</h1></div>
//                 <div className="buttons">
//                   <button></button>
//                   <button></button>
//                   <button></button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//     </div>
//   )
// }

// export default Contact


import React, { useState } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const dummyContacts = [
  { id: 1, name: "Name1" },
  { id: 2, name: "Name2" },
  { id: 3, name: "Name3" },
  { id: 4, name: "Name4" },
  { id: 5, name: "Name5" },
  { id: 6, name: "Name6" },
];

const ContactList = () => {
  const [search, setSearch] = useState("");

  const filteredContacts = dummyContacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-black flex justify-between items-center">
      {/* Header */}
      {/* <header className="w-full px-6 py-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-700">Connexus</h1>
        <Link to="/" className="text-cyan-600 font-medium hover:underline">Home</Link>
      </header> */}

      {/* Main container */}
      <div className="w-full max-w-md mx-auto p-4 mt-6 bg-white shadow-md rounded-lg">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {/* Contact List */}
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between bg-zinc-100 p-3 rounded-md shadow-sm hover:bg-zinc-200 transition"
            >
              <span className="font-medium text-gray-800">{contact.name}</span>
              <div className="flex items-center gap-2">
                <button className="text-cyan-600 hover:text-cyan-800">
                  <Phone size={20} />
                </button>
                <button className="text-cyan-600 hover:text-cyan-800">
                  <Video size={20} />
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <p className="text-center text-gray-500">No contacts found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
