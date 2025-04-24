import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; // Or use any icon set you prefer

const Footer = () => {
  return (
    <footer className="bg-[#1B9AAA] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Tagline */}
        <div>
          <h1 className="text-2xl font-bold mb-2 font-['Playwrite_IN'] ">Connexus</h1>
          <p className="text-sm">
            Secure, real-time peer-to-peer calling made simple and reliable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#working" className="hover:underline">How It Works</a></li>
            <li><a href="#security" className="hover:underline">Security</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300"><Facebook size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Twitter size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Instagram size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Divider and Bottom Text */}
      <div className="mt-8 border-t border-white/30 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Connexus. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

