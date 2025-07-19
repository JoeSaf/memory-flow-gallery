// Enhanced image utilities with smart prefetching and caching
import { Photo } from '../components/PhotoGallery';

// Cache for prefetched images to avoid duplicates
const prefetchCache = new Set<string>();
const prefetchElements = new Map<string, HTMLLinkElement>();

// Network-aware prefetching settings
const getNetworkAwarePrefetchSettings = () => {
  // @ts-ignore - navigator.connection might not be available in all browsers
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return { shouldPrefetch: true, maxPrefetch: 12, delay: 200 };
  }

  const effectiveType = connection.effectiveType;
  
  switch (effectiveType) {
    case '2g':
      return { shouldPrefetch: false, maxPrefetch: 0, delay: 0 };
    case '3g':
      return { shouldPrefetch: true, maxPrefetch: 6, delay: 400 };
    case '4g':
    default:
      return { shouldPrefetch: true, maxPrefetch: 12, delay: 200 };
  }
};

/**
 * Prefetch a single image URL with caching and cleanup
 */
export const prefetchImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already cached
    if (prefetchCache.has(url)) {
      resolve();
      return;
    }

    // Create link element for prefetching
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'image';
    
    link.onload = () => {
      prefetchCache.add(url);
      resolve();
    };
    
    link.onerror = () => {
      reject(new Error(`Failed to prefetch: ${url}`));
    };

    // Add to DOM and track for cleanup
    document.head.appendChild(link);
    prefetchElements.set(url, link);
    
    // Auto-cleanup after 30 seconds
    setTimeout(() => {
      cleanupPrefetchLink(url);
    }, 30000);
  });
};

/**
 * Clean up prefetch link from DOM
 */
const cleanupPrefetchLink = (url: string) => {
  const link = prefetchElements.get(url);
  if (link && link.parentNode) {
    link.parentNode.removeChild(link);
    prefetchElements.delete(url);
  }
};

/**
 * Prefetch multiple images with staggered delays
 */
export const prefetchImages = async (urls: string[], staggerDelay = 200): Promise<void> => {
  const { shouldPrefetch, maxPrefetch, delay } = getNetworkAwarePrefetchSettings();
  
  if (!shouldPrefetch) {
    return;
  }

  const urlsToProcess = urls.slice(0, maxPrefetch);
  
  for (let i = 0; i < urlsToProcess.length; i++) {
    // Stagger the requests
    setTimeout(() => {
      prefetchImage(urlsToProcess[i]).catch(error => {
        console.warn('Prefetch failed:', error);
      });
    }, i * (delay || staggerDelay));
  }
};

/**
 * Extract top images from gallery data for prefetching
 */
export const getTopGalleryImages = (galleryData: Photo[], count = 8) => {
  return galleryData
    .slice(0, count)
    .map(photo => photo.thumbnail);
};

/**
 * Check if image is already in cache
 */
export const isImageCached = (url: string): boolean => {
  return prefetchCache.has(url);
};

/**
 * Clear all prefetch cache and cleanup
 */
export const clearPrefetchCache = () => {
  prefetchCache.clear();
  prefetchElements.forEach((link, url) => {
    cleanupPrefetchLink(url);
  });
};

/**
 * Preload image with promise for progressive loading
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};