// Performance utilities for optimizing loading and rendering

/**
 * Intersection Observer hook for lazy loading and animations
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  if (typeof window !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, defaultOptions);

    return observer;
  }
  return null;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Web Vitals measurement utilities
 */
export function measureWebVitals() {
  if (typeof window !== 'undefined') {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any; // LayoutShift interface may not be available
        if (layoutShiftEntry.hadRecentInput === false) {
          clsValue += layoutShiftEntry.value || 0;
          console.log('CLS:', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy loading with Intersection Observer
 */
export function setupLazyLoading() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  }
}

/**
 * Resource prefetching
 */
export function prefetchResource(href: string, as: string = 'fetch') {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
}

/**
 * Critical resource preloading
 */
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
}

/**
 * Service Worker registration for caching
 */
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  }
}

/**
 * Image format detection and optimization
 */
export function getOptimizedImageFormat(): 'avif' | 'webp' | 'jpg' {
  if (typeof window === 'undefined') return 'webp';
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Check AVIF support
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  return 'jpg';
}

/**
 * Connection speed detection
 */
export function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      const speed = connection.downlink;
      if (speed < 1.5) return 'slow';
      if (speed > 5) return 'fast';
    }
  }
  return 'unknown';
}

/**
 * Bundle size optimization checker
 */
export function logBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      let totalSize = 0;
      
      scripts.forEach((script) => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('/_next/')) {
          fetch(src, { method: 'HEAD' })
            .then((response) => {
              const size = parseInt(response.headers.get('content-length') || '0');
              totalSize += size;
              console.log(`Bundle: ${src.split('/').pop()} - ${(size / 1024).toFixed(2)}KB`);
            })
            .catch(() => {});
        }
      });
      
      setTimeout(() => {
        console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
      }, 1000);
    }, 2000);
  }
}
