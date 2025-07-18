import { useEffect, useRef, useState } from 'react';
import { Photo } from '../components/PhotoGallery';
import { getThumbnailUrl } from '../lib/cloudinary';
import { prefetchImages, getTopGalleryImages } from '../lib/image-utils';

interface UseSmartPrefetchOptions {
  engagementTimeMs?: number;
  scrollThreshold?: number;
  maxImages?: number;
}

/**
 * Smart prefetching hook that triggers based on user engagement
 * - Prefetches after user stays on page for specified time
 * - Also triggers on scroll past threshold
 * - Network-aware and respects user's connection
 */
export const useSmartPrefetch = (
  galleryData: Photo[],
  options: UseSmartPrefetchOptions = {}
) => {
  const {
    engagementTimeMs = 3000, // 3 seconds
    scrollThreshold = 100,   // 100px scroll
    maxImages = 8
  } = options;

  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const hasTriggeredRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerPrefetch = async () => {
    if (hasTriggeredRef.current || !galleryData.length) {
      return;
    }

    hasTriggeredRef.current = true;
    setIsPrefetching(true);

    try {
      // Get top images for prefetching
      const topImages = getTopGalleryImages(galleryData, maxImages);
      
      // Convert to Cloudinary URLs
      const cloudinaryUrls = topImages.map(thumbnail => getThumbnailUrl(thumbnail));
      
      // Start prefetching with staggered delays
      await prefetchImages(cloudinaryUrls, 200);
      
      setPrefetched(true);
      console.log(`Smart prefetch completed: ${cloudinaryUrls.length} images`);
    } catch (error) {
      console.warn('Smart prefetch failed:', error);
    } finally {
      setIsPrefetching(false);
    }
  };

  useEffect(() => {
    // Time-based engagement trigger
    timeoutRef.current = setTimeout(() => {
      triggerPrefetch();
    }, engagementTimeMs);

    // Scroll-based engagement trigger
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        triggerPrefetch();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [galleryData, engagementTimeMs, scrollThreshold]);

  return {
    isPrefetching,
    prefetched,
    triggerPrefetch
  };
};