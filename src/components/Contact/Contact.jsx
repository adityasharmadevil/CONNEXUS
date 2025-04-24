import React from 'react'
import './Contact.css'

function Contact() {
  return (
    <div className='contact'>
        <div className="header">
          <div id="logo">Connexus</div>
        </div>
        <h1>Make a call </h1>
        <div className="contacts">
          <div className="contact-list">
            <h1>Contacts</h1>
            <div className="searchbar"><input type="text" placeholder='Search contacts'/></div>
            <div className="list">
              <div className="user-contact">
                <div className="name"><h1>Name1</h1></div>
                <div className="buttons">
                  <button></button>
                  <button></button>
                  <button></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default Contact
