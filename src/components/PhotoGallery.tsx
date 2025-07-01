
import React, { useState, useEffect } from 'react';
import { PhotoGrid } from './PhotoGrid';
import { FloatingViewer } from './FloatingViewer';
import { TimeSlider } from './TimeSlider';
import { AmbientControls } from './AmbientControls';
import { Header } from './Header';
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
  const [sortBy, setSortBy] = useState<'date' | 'season'>('date');
  const [isAmbientMode, setIsAmbientMode] = useState(false);
  const [currentAmbientIndex, setCurrentAmbientIndex] = useState(0);

  useEffect(() => {
    setPhotos(galleryData as Photo[]);
  }, []);

  useEffect(() => {
    if (isAmbientMode && photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentAmbientIndex((prev) => (prev + 1) % photos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAmbientMode, photos.length]);

  const sortedPhotos = [...photos].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
      return seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season);
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
      <Header />
      
      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <TimeSlider sortBy={sortBy} setSortBy={setSortBy} />
          <AmbientControls 
            isAmbientMode={isAmbientMode}
            setIsAmbientMode={setIsAmbientMode}
          />
        </div>

        <PhotoGrid 
          photos={sortedPhotos}
          onPhotoClick={handlePhotoClick}
          ambientPhoto={isAmbientMode ? sortedPhotos[currentAmbientIndex] : null}
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
