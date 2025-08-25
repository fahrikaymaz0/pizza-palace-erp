'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface PremiumImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (e: any) => void;
  fallbackSrc?: string;
}

export default function PremiumImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes = '100vw',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc
}: PremiumImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const mountedRef = useRef(true);

  // Fallback image if main image fails
  const defaultFallback = '/pizzas/margherita.png';

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Update image source when src prop changes
  useEffect(() => {
    if (!mountedRef.current) return;
    
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    if (!mountedRef.current) return;
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((e: any) => {
    if (!mountedRef.current) return;
    
    console.error('Image load error:', src);
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback image only if not already using it
    const targetFallback = fallbackSrc || defaultFallback;
    if (imageSrc !== targetFallback) {
      setImageSrc(targetFallback);
    }
    
    onError?.(e);
  }, [src, imageSrc, onError]);

  // Simple shimmer effect
  const shimmerDataURL = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f6f7f8"/>
      <rect width="400" height="300" fill="url(#g)">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1s" repeatCount="indefinite"/>
      </rect>
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%"/>
          <stop stop-color="#edeef1" offset="50%"/>
          <stop stop-color="#f6f7f8" offset="80%"/>
        </linearGradient>
      </defs>
    </svg>
  `)}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || shimmerDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          objectFit: 'cover'
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍕</span>
            </div>
            <p className="text-sm">Görsel yüklenemedi</p>
          </div>
        </div>
      )}
    </div>
  );
}
