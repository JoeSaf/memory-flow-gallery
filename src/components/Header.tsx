
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-4 left-4 right-4 z-40">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-2xl animate-gentle-fade">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left animate-gentle-fade">
              <h1 className="text-3xl md:text-4xl font-poppins font-light text-charcoal mb-1">
                Memoir Gallery
              </h1>
              <p className="text-slate-gray font-inter text-sm opacity-80">
                A gentle collection of moments that once were
              </p>
            </div>
            
            <nav className="flex gap-6 animate-gentle-fade" style={{ animationDelay: '100ms' }}>
              <Link 
                to="/"
                className={`font-inter text-lg transition-all duration-300 hover:text-dusty-rose ${
                  location.pathname === '/' ? 'text-dusty-rose font-medium' : 'text-slate-gray'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/gallery"
                className={`font-inter text-lg transition-all duration-300 hover:text-dusty-rose ${
                  location.pathname === '/gallery' ? 'text-dusty-rose font-medium' : 'text-slate-gray'
                }`}
              >
                Gallery
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
