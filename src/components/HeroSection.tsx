
import React from 'react';

export const HeroSection = () => {
  return (
    <section className="text-center py-16 animate-gentle-fade">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-poppins font-light text-charcoal mb-6 animate-gentle-fade">
          Memento Mori
        </h1>
        <p className="text-xl md:text-2xl font-inter text-slate-gray opacity-90 leading-relaxed animate-gentle-fade" style={{ animationDelay: '200ms' }}>
          A gentle collection of moments that once were
        </p>
      </div>
    </section>
  );
};
