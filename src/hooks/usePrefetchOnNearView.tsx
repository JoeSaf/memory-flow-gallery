import { useEffect, useRef, useState } from 'react';
import { Photo } from '../components/PhotoGallery';
import { getThumbnailUrl } from '../lib/cloudinary';
import { prefetchImages } from '../lib/image-utils';

interface UsePrefetchOnNearViewOptions {
  threshold?: number; // Distance in pixels before element is visible
  maxImages?: number;
}

/**
 * Hook that prefetches images when user approaches a target element
 * Uses Intersection Observer to detect when element is near viewport
 */
export const usePrefetchOnNearView = (
  galleryData: Photo[],
  options: UsePrefetchOnNearViewOptions = {}
) => {
  const {
    threshold = 200, // 200px before visible
    maxImages = 12
  } = options;

  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || hasTriggeredRef.current || !galleryData.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setIsPrefetching(true);

            // Prefetch gallery images
            const imagesToPrefetch = galleryData
              .slice(0, maxImages)
              .map(photo => getThumbnailUrl(photo.thumbnail));

            prefetchImages(imagesToPrefetch, 150)
              .then(() => {
                setPrefetched(true);
                console.log(`Near-view prefetch completed: ${imagesToPrefetch.length} images`);
              })
              .catch((error) => {
                console.warn('Near-view prefetch failed:', error);
              })
              .finally(() => {
                setIsPrefetching(false);
              });
          }
        });
      },
      {
        // Expand root margin to trigger before element is visible
        rootMargin: `${threshold}px 0px ${threshold}px 0px`,
        threshold: 0
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [galleryData, threshold, maxImages]);

  return {
    targetRef,
    isPrefetching,
    prefetched
  };
};