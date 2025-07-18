
import React, { useEffect, useState } from 'react';
import { PhotoGallery } from '../components/PhotoGallery';
import { Header } from '../components/Header';
import { usePrefetchOnNearView } from '../hooks/usePrefetchOnNearView';
import { Photo } from '../components/PhotoGallery';
import galleryData from '../data/gallery.json';

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Load gallery data for prefetching
  useEffect(() => {
    setPhotos(galleryData as Photo[]);
  }, []);

  // Prefetch when user approaches gallery content
  const { targetRef, isPrefetching, prefetched } = usePrefetchOnNearView(photos, {
    threshold: 200,   // 200px before visible
    maxImages: 12     // Extended prefetch set
  });

  return (
    <div className="relative">
      <Header />
      <div className="pt-8" ref={targetRef}>
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
