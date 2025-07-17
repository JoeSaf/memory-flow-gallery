
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { auto as autoFormat } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoQuality } from '@cloudinary/url-gen/actions/delivery';

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  }
});

export interface ImageSizeOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
}

/**
 * Convert local image path to optimized Cloudinary URL
 * @param imagePath - Local path like "images/telephonenom.jpg"
 * @param options - Size and optimization options
 * @returns Optimized Cloudinary URL
 */
export const getCloudinaryUrl = (imagePath: string, options: ImageSizeOptions = {}) => {
  // Remove leading slash and "images/" prefix if present
  const cleanPath = imagePath.replace(/^\/?(images\/)?/, '');
  
  // Remove file extension for Cloudinary
  const publicId = cleanPath.replace(/\.[^/.]+$/, '');
  
  // Create Cloudinary image instance
  const image = cld.image(publicId);
  
  // Apply automatic format and quality optimization
  image.delivery(autoFormat()).delivery(autoQuality());
  
  // Apply resizing if specified
  if (options.width || options.height) {
    image.resize(auto().width(options.width).height(options.height));
  }
  
  return image.toURL();
};

/**
 * Get thumbnail-optimized Cloudinary URL (for PhotoCard)
 */
export const getThumbnailUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 400,
    height: 300,
    quality: 'auto'
  });
};

/**
 * Get medium-sized optimized Cloudinary URL
 */
export const getMediumUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 800,
    height: 600,
    quality: 'auto'
  });
};

/**
 * Get full-size optimized Cloudinary URL (for FloatingViewer)
 */
export const getFullUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 1200,
    quality: 'auto'
  });
};

/**
 * Check if Cloudinary is properly configured
 */
export const isCloudinaryConfigured = () => {
  return !!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && 
         import.meta.env.VITE_CLOUDINARY_CLOUD_NAME !== 'demo';
};
