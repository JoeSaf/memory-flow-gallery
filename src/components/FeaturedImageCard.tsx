
import React, { useState } from 'react';
import { useProgressiveImage } from '../hooks/useProgressiveImage';
import { getProgressiveUrls, isCloudinaryConfigured } from '../lib/cloudinary';

export const FeaturedImageCard = () => {
  // You can easily change these values to customize the featured image
  const featuredImage = {
    src: "/images/charzpuplr.jpg", // Change this to your desired image path
    alt: "Fine Arts", // Change this to describe your image
    title: "Memoir" // Change this to your desired title
  };

  // Progressive loading setup
  const progressiveUrls = isCloudinaryConfigured() ? getProgressiveUrls(featuredImage.src) : null;
  const enableProgressive = isCloudinaryConfigured() && !!progressiveUrls;

  const { currentStage, isLoading, isError } = useProgressiveImage(
    progressiveUrls?.placeholder || featuredImage.src,
    progressiveUrls?.lowQuality || featuredImage.src,
    progressiveUrls?.highQuality || featuredImage.src,
    { enableProgressive }
  );

  // Use progressive image or fallback
  const imageUrl = enableProgressive && !isError ? currentStage.src : featuredImage.src;

  return (
    <section className="max-w-2xl mx-auto animate-gentle-fade">
      <div className="relative overflow-hidden rounded-3xl bg-foggy-blue/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
        <div className="aspect-[4/3] bg-gradient-to-br from-foggy-blue/20 to-dusty-rose/20">
          <img
            src={imageUrl}
            alt={featuredImage.alt}
            className={`
              w-full h-full object-cover transition-all duration-500
              ${currentStage.loaded ? 'opacity-100' : 'opacity-0'}
              ${currentStage.stage === 'placeholder' ? 'filter blur-sm' : ''}
              ${currentStage.stage === 'lowQuality' ? 'filter blur-[1px]' : ''}
            `}
          />
          
          {/* Loading shimmer overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
          
          {/* Subtle overlay gradient - keep existing */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
        </div>
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <div className="bg-warm-cream/90 backdrop-blur-sm rounded-2xl px-4 py-3 inline-block shadow-lg">
            <p className="font-inter text-charcoal font-medium text-lg">
              {featuredImage.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
