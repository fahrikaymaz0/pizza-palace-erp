'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RoyalParallaxSceneProps {
  className?: string;
  children?: React.ReactNode;
}

export default function RoyalParallaxScene({ className, children }: RoyalParallaxSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stars = useMemo(
    () => Array.from({ length: 120 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() > 0.7,
    })),
    []
  );

  const floatingElements = useMemo(
    () => Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 20 + Math.random() * 60,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 4,
      type: Math.random() > 0.5 ? 'crown' : 'gem',
    })),
    []
  );

  return (
    <div 
      className={`${className ?? ''} relative overflow-hidden`} 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Crowns and Gems */}
      {floatingElements.map((element, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            width: element.size,
            height: element.size,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {element.type === 'crown' ? (
            <div className="w-full h-full flex items-center justify-center text-yellow-400 opacity-20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-400 opacity-20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L13.09 8.26L20 9.27L14 14.14L15.18 21.02L12 17.77L8.82 21.02L10 14.14L4 9.27L10.91 8.26L12 2Z"/>
              </svg>
            </div>
          )}
        </motion.div>
      ))}

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
              opacity: star.opacity,
            }}
            animate={star.twinkle ? {
              scale: [1, 1.5, 1],
              opacity: [star.opacity, 1, star.opacity],
            } : {
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Royal Banners */}
      <motion.div
        className="absolute left-8 top-0 w-24 h-3/4"
        style={{
          background: 'linear-gradient(180deg, #d4af37 0%, #b8860b 50%, #8b6914 100%)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
        }}
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-8 top-0 w-24 h-3/4"
        style={{
          background: 'linear-gradient(180deg, #c41e3a 0%, #8b0000 50%, #4a0000 100%)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(196, 30, 58, 0.3)',
        }}
        animate={{
          y: [0, -10, 0],
          rotateY: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Central Royal Aura */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-96 h-96"
        style={{
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(196, 30, 58, 0.1) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Parallax Content */}
      <motion.div
        className="relative z-10 w-full h-full"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      >
        {children}
      </motion.div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}


