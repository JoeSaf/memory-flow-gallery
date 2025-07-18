
import React, { useState, useEffect } from 'react';
import { PhotoGrid } from './PhotoGrid';
import { FloatingViewer } from './FloatingViewer';
import { TimeSlider } from './TimeSlider';

import galleryData from '../data/gallery.json';

export interface Photo {
  id: number;
  title: string;
  filename: string;
  thumbnail: string;
  date: string;
  tag: string;
  season: string;
  caption: string;
}

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'year'>('date');

  useEffect(() => {
    setPhotos(galleryData as Photo[]);
  }, []);

  const sortedPhotos = [...photos].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // Sort by year
      const yearA = new Date(a.date).getFullYear();
      const yearB = new Date(b.date).getFullYear();
      return yearB - yearA;
    }
  });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    console.log('Photo selected:', photo.title);
  };

  const handleNavigate = (photo: Photo) => {
    setSelectedPhoto(photo);
    console.log('Navigated to photo:', photo.title);
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
    console.log('Photo viewer closed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-foggy-blue/20 to-dusty-rose/20">
      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="flex justify-center mb-8">
          <TimeSlider sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <PhotoGrid 
          photos={sortedPhotos}
          onPhotoClick={handlePhotoClick}
        />

        {selectedPhoto && (
          <FloatingViewer 
            photo={selectedPhoto}
            photos={sortedPhotos}
            onClose={closeViewer}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
};
