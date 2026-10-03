import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Logo from '../assets/AdobeStock_591326907.jpeg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div>
      <div className="bg-black text-white py-1 px-4 md:grid hidden">
        <div className="flex justify-between items-center">
          <Link to="/subscribe" className=" lg:text-lg md:text-md sm:text-xs italic underline hover:text-blue ">Special Offer: Follow Us and Stand a Chance to Get Full Access to Exclusive Tech Events!</Link>
          <Link to="#" className="flex gap-4 sm:px-1">
            <FontAwesomeIcon 
              icon={faFacebook} 
              className="text-white hover:text-blue-500 text-xl transition"
            />
            <FontAwesomeIcon 
              icon={faTwitter} 
              className="text-white hover:text-blue-400 text-xl transition"
            />
            <FontAwesomeIcon 
              icon={faInstagram} 
              className="text-white hover:text-pink-500 text-xl transition"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between max-w-full mx-auto py-2 px-4 bg-transparent">
        <div className="flex items-center">
          <img 
            src={Logo} 
            alt="Logo" 
            className="h-10 md:h-12 w-auto"
          />
          <span className="text-2xl font-semibold text-black ml-2">KODEMOR</span>
        </div>

        <ul className="hidden md:flex space-x-12 text-lg mt-3 ml-auto">
          <li><Link to="/About" className="text-black font-light hover:text-gray-700">Home</Link></li>
          <li><Link to="/Blogs" className="text-black font-light hover:text-gray-700">Blogs</Link></li>
          <li><Link to="/Create" className="text-black font-light hover:text-gray-700">Create Post</Link></li>
          {!loading && (user ? (
            <li className="flex items-center gap-3">
              {user.picture && (
                <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
              )}
              <button onClick={signOut} className="text-black font-light hover:text-gray-700">Sign out</button>
            </li>
          ) : (
            <li><Link to="/login" className="text-black font-light hover:text-gray-700">Sign in</Link></li>
          ))}
        </ul>

        <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <ul className="md:hidden bg-white border-t flex flex-col space-y-2 py-3 text-center text-md">
          <li><Link to="/About" className="block py-2 text-black font-light hover:text-gray-700">Home</Link></li>
          <li><Link to="/Blogs" className="block py-2 text-black font-light hover:text-gray-700">Blog</Link></li>
          <li><Link to="/Create" className="block py-2 text-black font-light hover:text-gray-700">Create Post</Link></li>
          {!loading && (user ? (
            <li><button onClick={signOut} className="block w-full py-2 text-black font-light hover:text-gray-700">Sign out ({user.name})</button></li>
          ) : (
            <li><Link to="/login" className="block py-2 text-black font-light hover:text-gray-700">Sign in</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
