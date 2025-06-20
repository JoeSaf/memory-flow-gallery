
import React from 'react';
import { PhotoCard } from './PhotoCard';
import { Photo } from './PhotoGallery';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  ambientPhoto: Photo | null;
}

export const PhotoGrid = ({ photos, onPhotoClick, ambientPhoto }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-gentle-fade">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(photo)}
          isHighlighted={ambientPhoto?.id === photo.id}
          delay={index * 100}
        />
      ))}
    </div>
  );
};
