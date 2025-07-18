import { useState, useEffect } from 'react';
import { preloadImage } from '../lib/image-utils';

export interface ProgressiveImageStage {
  stage: 'placeholder' | 'lowQuality' | 'highQuality' | 'error';
  src: string;
  loaded: boolean;
}

interface UseProgressiveImageOptions {
  enableProgressive?: boolean;
}

/**
 * Hook for progressive image loading with 3 stages:
 * 1. Tiny blurred placeholder
 * 2. Low quality version
 * 3. High quality version
 */
export const useProgressiveImage = (
  placeholderSrc: string,
  lowQualitySrc: string,
  highQualitySrc: string,
  options: UseProgressiveImageOptions = {}
) => {
  const { enableProgressive = true } = options;
  
  const [currentStage, setCurrentStage] = useState<ProgressiveImageStage>({
    stage: 'placeholder',
    src: placeholderSrc,
    loaded: false
  });

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!enableProgressive) {
      // Skip progressive loading, go straight to high quality
      preloadImage(highQualitySrc)
        .then(() => {
          setCurrentStage({
            stage: 'highQuality',
            src: highQualitySrc,
            loaded: true
          });
          setLoadingProgress(100);
        })
        .catch(() => {
          setCurrentStage({
            stage: 'error',
            src: placeholderSrc,
            loaded: false
          });
        });
      return;
    }

    let isMounted = true;

    const loadProgressive = async () => {
      try {
        // Stage 1: Show placeholder immediately
        setCurrentStage({
          stage: 'placeholder',
          src: placeholderSrc,
          loaded: true
        });
        setLoadingProgress(10);

        // Stage 2: Load low quality
        await preloadImage(lowQualitySrc);
        if (!isMounted) return;

        setCurrentStage({
          stage: 'lowQuality',
          src: lowQualitySrc,
          loaded: true
        });
        setLoadingProgress(50);

        // Small delay to show low quality briefly
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!isMounted) return;

        // Stage 3: Load high quality
        await preloadImage(highQualitySrc);
        if (!isMounted) return;

        setCurrentStage({
          stage: 'highQuality',
          src: highQualitySrc,
          loaded: true
        });
        setLoadingProgress(100);

      } catch (error) {
        if (!isMounted) return;
        
        console.warn('Progressive image loading failed:', error);
        setCurrentStage({
          stage: 'error',
          src: placeholderSrc,
          loaded: false
        });
      }
    };

    loadProgressive();

    return () => {
      isMounted = false;
    };
  }, [placeholderSrc, lowQualitySrc, highQualitySrc, enableProgressive]);

  return {
    currentStage,
    loadingProgress,
    isLoading: currentStage.stage !== 'highQuality' && currentStage.stage !== 'error',
    isError: currentStage.stage === 'error'
  };
};