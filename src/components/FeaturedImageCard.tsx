
import React, { useState } from 'react';

export const FeaturedImageCard = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="max-w-2xl mx-auto animate-gentle-fade">
      <div className="relative overflow-hidden rounded-3xl bg-foggy-blue/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
        <div className="aspect-[4/3] bg-gradient-to-br from-foggy-blue/20 to-dusty-rose/20">
          <img
            src="/gallery/photos/IMG_9923.webp"
            alt="Petrol Heads"
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
        </div>
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <div className="bg-warm-cream/90 backdrop-blur-sm rounded-2xl px-4 py-3 inline-block shadow-lg">
            <p className="font-inter text-charcoal font-medium text-lg">
              Petrol Heads
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
