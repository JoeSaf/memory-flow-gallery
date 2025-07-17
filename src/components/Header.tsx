
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Memoir Gallery
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-600 transition-colors ${
                location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`hover:text-blue-600 transition-colors ${
                location.pathname === '/gallery' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              Gallery
            </Link>
            {/* Development-only admin link */}
            {import.meta.env.DEV && (
              <Link 
                to="/admin" 
                className={`hover:text-orange-600 transition-colors ${
                  location.pathname === '/admin' ? 'text-orange-600 font-semibold' : 'text-orange-500'
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
