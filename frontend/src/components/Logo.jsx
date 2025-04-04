import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="mr-2">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M25 5L5 15V35L25 45L45 35V15L25 5Z" 
            stroke="#00E8FF" 
            strokeWidth="2" 
            fill="transparent"
          />
          <path 
            d="M25 15L15 20V30L25 35L35 30V20L25 15Z" 
            stroke="#00E8FF" 
            strokeWidth="2" 
            fill="transparent"
          />
          <path 
            d="M5 15L25 25L45 15" 
            stroke="#00E8FF" 
            strokeWidth="2"
          />
          <path 
            d="M25 25L25 45" 
            stroke="#00E8FF" 
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-[#00E8FF] text-xl font-bold tracking-wider">NYX</span>
        <span className="text-white text-sm font-light tracking-wider">Cipher</span>
      </div>
    </Link>
  );
};

export default Logo;