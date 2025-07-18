
// Simple Cloudinary URL builder without package dependencies
const CLOUDINARY_CLOUD_NAME = 'dxmpicoqj';
const CLOUDINARY_FOLDER = 'memoir-gallery';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface ImageSizeOptions {
  width?: number;
  height?: number;
  quality?: string;
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
  
  // Build transformation parameters
  const transformations = [];
  
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  
  // Add crop mode if both width and height are specified
  if (options.width && options.height) {
    transformations.push('c_fill');
  }
  
  // Add automatic format and quality optimization
  transformations.push('f_auto', 'q_auto');
  
  // Build the complete URL
  const transformationString = transformations.join(',');
  return `${CLOUDINARY_BASE_URL}/${transformationString}/${CLOUDINARY_FOLDER}/${publicId}`;
};

/**
 * Get thumbnail-optimized Cloudinary URL (for PhotoCard)
 */
export const getThumbnailUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 400,
    height: 300
  });
};

/**
 * Get medium-sized optimized Cloudinary URL
 */
export const getMediumUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 800,
    height: 600
  });
};

/**
 * Get full-size optimized Cloudinary URL (for FloatingViewer)
 */
export const getFullUrl = (imagePath: string) => {
  return getCloudinaryUrl(imagePath, {
    width: 1200
  });
};

/**
 * Check if Cloudinary is properly configured
 */
export const isCloudinaryConfigured = () => {
  return !!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && 
         import.meta.env.VITE_CLOUDINARY_CLOUD_NAME !== 'demo';
};
