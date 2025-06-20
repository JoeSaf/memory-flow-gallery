
import React from 'react';

export const Header = () => {
  return (
    <header className="bg-warm-cream/80 backdrop-blur-sm border-b border-foggy-blue/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center animate-gentle-fade">
          <h1 className="text-4xl md:text-6xl font-poppins font-light text-charcoal mb-2">
            Memento Mori
          </h1>
          <p className="text-slate-gray font-inter text-sm md:text-base opacity-80">
            A gentle collection of moments that once were
          </p>
        </div>
      </div>
    </header>
  );
};
