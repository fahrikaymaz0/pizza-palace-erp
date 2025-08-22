'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PremiumImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (e: any) => void;
}

const PremiumImage: React.FC<PremiumImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 90,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imageRef.current && !priority) {
      observer.observe(imageRef.current);
    } else {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate optimized blur placeholder if not provided
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Create a simple colored blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Pizza-themed gradient
      const gradient = ctx.createLinearGradient(0, 0, 10, 10);
      gradient.addColorStop(0, '#DC2626'); // Red
      gradient.addColorStop(0.5, '#F59E0B'); // Orange
      gradient.addColorStop(1, '#EAB308'); // Yellow
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 10, 10);
    }
    
    return canvas.toDataURL();
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = (e: any) => {
    setHasError(true);
    onError?.(e);
  };

  // Fallback image for errors
  const fallbackSrc = '/images/pizza-placeholder.jpg';

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Main image */}
      {(isInView || priority) && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <Image
            src={hasError ? fallbackSrc : src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes}
            quality={quality}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={generateBlurDataURL()}
            onLoad={handleLoad}
            onError={handleError}
            className={`
              object-cover transition-transform duration-700 hover:scale-105
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              objectPosition: 'center',
            }}
          />
        </motion.div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-2">🍕</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Görsel yüklenemedi</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PremiumImage;
