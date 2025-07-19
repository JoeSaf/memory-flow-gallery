
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-charcoal hover:text-dusty-rose transition-colors duration-300">
            Memoir Gallery
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-dusty-rose transition-colors duration-300 ${
                location.pathname === '/' ? 'text-dusty-rose font-semibold' : 'text-charcoal/80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`hover:text-dusty-rose transition-colors duration-300 ${
                location.pathname === '/gallery' ? 'text-dusty-rose font-semibold' : 'text-charcoal/80'
              }`}
            >
              Gallery
            </Link>
            {/* Development-only admin link */}
            {import.meta.env.DEV && (
              <Link 
                to="/admin" 
                className={`hover:text-dusty-rose transition-colors duration-300 ${
                  location.pathname === '/admin' ? 'text-dusty-rose font-semibold' : 'text-charcoal/60'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
