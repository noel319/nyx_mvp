import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/signin');
  };

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <nav className="bg-[#0A0E15] border-b border-[#1A1E26] px-4 md:px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="hidden md:flex space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-white hover:text-[#00E8FF] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="primary" 
            className="border-2" 
            onClick={handleLaunchApp}
          >
            Launch App
          </Button>
          
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-[1px]"
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/signin')}
              className="border-[1px]"
            >
              Sign In
            </Button>
          )}
          
          <div className="hidden md:flex space-x-2 ml-2">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00E8FF]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00E8FF]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;