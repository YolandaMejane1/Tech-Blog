import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const ContactUs = () => {
  return (
    <div className="bg-black text-white p-10 w-full flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-thin mb-6 text-center">Code For Life</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-4xl text-center gap-6 md:gap-0">
        <div className="flex justify-center items-center border-r md:border-r-white pr-4">
          <FontAwesomeIcon icon={faFacebookF} className="text-2xl mx-3 cursor-pointer hover:text-gray-400" />
          <FontAwesomeIcon icon={faTwitter} className="text-2xl mx-3 cursor-pointer hover:text-gray-400" />
          <FontAwesomeIcon icon={faInstagram} className="text-2xl mx-3 cursor-pointer hover:text-gray-400" />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm font-thin mb-1">Enter your email here</label>
          <input
            type="email"
            className="p-2 border border-white text-white bg-black w-60"
          />
          <div className="flex items-center mt-2">
            <input type="checkbox" id="newsletter" className="mr-2" />
            <label htmlFor="newsletter" className="text-sm font-thin">Subscribe to our newsletter</label>
          </div>
          <button className="mt-3 p-2 border border-white text-white bg-black w-60 hover:bg-gray-700 font-thin">
            Subscribe
          </button>
        </div>

        <div className="flex justify-center items-center border-l md:border-l-white pl-4">
          <p className="text-white font-thin">© 2025 by Kodemor. <br /> Code For Life.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
