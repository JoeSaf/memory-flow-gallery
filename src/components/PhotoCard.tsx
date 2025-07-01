
import React, { useState } from 'react';
import { Photo } from './PhotoGallery';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  isHighlighted?: boolean;
  delay?: number;
}

export const PhotoCard = ({ photo, onClick, isHighlighted = false, delay = 0 }: PhotoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    console.log('Image loaded successfully:', photo.thumbnail);
  };

  const handleImageError = () => {
    setImageError(true);
    console.log('Image failed to load:', photo.thumbnail);
  };

  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-500 ease-out
        ${isHighlighted ? 'animate-drift scale-105 ring-2 ring-dusty-rose/50' : 'hover:scale-105 animate-float'}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-2xl bg-foggy-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="aspect-[4/3] bg-gradient-to-br from-foggy-blue/20 to-dusty-rose/20">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <div className="text-center">
                <p className="text-sm">Failed to load image</p>
                <p className="text-xs mt-1">{photo.thumbnail}</p>
              </div>
            </div>
          ) : (
            <img
              src={photo.thumbnail}
              alt={photo.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Caption overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
            <div className="text-warm-cream animate-gentle-fade">
              <p className="text-sm font-inter italic leading-relaxed">
                "{photo.caption}"
              </p>
              <p className="text-xs opacity-80 mt-1">
                {new Date(photo.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Title and metadata */}
      <div className="mt-3 space-y-1">
        <h3 className="text-charcoal font-poppins font-medium text-lg group-hover:text-slate-gray transition-colors">
          {photo.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-gray/80">
          <span className="bg-dusty-rose/20 px-2 py-1 rounded-full capitalize">
            {photo.season}
          </span>
          <span className="bg-foggy-blue/20 px-2 py-1 rounded-full">
            {photo.tag}
          </span>
        </div>
      </div>
    </div>
  );
};
