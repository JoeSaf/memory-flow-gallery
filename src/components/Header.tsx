
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-warm-cream/80 backdrop-blur-sm border-b border-foggy-blue/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
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
    </header>
  );
};
