import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from './PhotoGallery';
import { getFullUrl, isCloudinaryConfigured } from '../lib/cloudinary';

interface FloatingViewerProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export const FloatingViewer = ({ photo, photos, onClose, onNavigate }: FloatingViewerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  // Find current photo index
  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  // Use Cloudinary URL if configured, otherwise fallback to local path
  const imageUrl = isCloudinaryConfigured() 
    ? getFullUrl(photo.filename)
    : photo.filename;

  // Center the popup when it first appears
  useEffect(() => {
    const centerPopup = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popupWidth = Math.min(viewportWidth * 0.9, 600);
      const popupHeight = Math.min(viewportHeight * 0.9, 800);
      
      const centerX = (viewportWidth - popupWidth) / 2;
      const centerY = (viewportHeight - popupHeight) / 2;
      
      setPosition({ x: centerX, y: centerY });
    };

    centerPopup();
    window.addEventListener('resize', centerPopup);
    return () => window.removeEventListener('resize', centerPopup);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrevious, hasNext]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !viewerRef.current) return;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const rect = viewerRef.current.getBoundingClientRect();
      
      let newX = position.x + (e.clientX - dragStart.x);
      let newY = position.y + (e.clientY - dragStart.y);
      
      // Keep popup within viewport bounds
      newX = Math.max(0, Math.min(newX, viewportWidth - rect.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - rect.height));
      
      setPosition({ x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === viewerRef.current || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      const previousPhoto = photos[currentIndex - 1];
      onNavigate(previousPhoto);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextPhoto = photos[currentIndex + 1];
      onNavigate(nextPhoto);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40 animate-gentle-fade"
        onClick={onClose}
      />
      
      {/* Floating Viewer */}
      <div
        ref={viewerRef}
        className="fixed z-50 bg-warm-cream rounded-3xl shadow-2xl overflow-hidden border border-foggy-blue/20 animate-gentle-fade"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: 'min(90vw, 600px)',
          maxHeight: '90vh',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header with drag handle */}
        <div className="drag-handle bg-slate-gray/10 p-4 border-b border-foggy-blue/10 flex items-center justify-between">
          <div>
            <h2 className="font-poppins font-semibold text-charcoal text-xl">
              {photo.title}
            </h2>
            <p className="text-slate-gray text-sm">
              {new Date(photo.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-gray text-sm">
              {currentIndex + 1} of {photos.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-dusty-rose/20 text-slate-gray hover:bg-dusty-rose/40 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Image with navigation */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={photo.title}
            className="w-full h-auto max-h-[60vh] object-contain bg-gradient-to-br from-foggy-blue/5 to-dusty-rose/5"
            loading="eager"
          />
          
          {/* Navigation buttons */}
          {hasPrevious && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal/70 text-warm-cream rounded-full hover:bg-charcoal/90 transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal/70 text-warm-cream rounded-full hover:bg-charcoal/90 transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Caption and metadata */}
        <div className="p-6 space-y-4">
          <blockquote className="text-charcoal font-inter italic text-lg leading-relaxed border-l-4 border-dusty-rose pl-4">
            "{photo.caption}"
          </blockquote>
          
          <div className="flex items-center gap-3">
            <span className="bg-dusty-rose/20 text-charcoal px-3 py-1 rounded-full text-sm capitalize">
              {photo.season}
            </span>
            <span className="bg-foggy-blue/20 text-charcoal px-3 py-1 rounded-full text-sm">
              {photo.tag}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
