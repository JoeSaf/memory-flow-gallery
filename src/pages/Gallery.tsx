
import React from 'react';
import { PhotoGallery } from '../components/PhotoGallery';
import { Header } from '../components/Header';

const Gallery = () => {
  return (
    <div className="relative">
      <Header />
      <div className="pt-8">
        <PhotoGallery />
      </div>
      
      {/* Floating Glassmorphism Footer */}
      <footer className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-2xl animate-gentle-fade">
            <div className="text-center">
              <p className="font-inter text-charcoal/90 text-sm">
                © 2025 Memoir Gallery. 
                <a 
                  href="https://jonesclavery.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-dusty-rose hover:text-charcoal transition-colors duration-300 font-medium"
                >
                  Designed and coded by Jones
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
