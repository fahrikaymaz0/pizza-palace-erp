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

  // Minimalist dot stars that only blink (no scaling or glow)
  const stars = useMemo(
    () => Array.from({ length: 140 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 1.8,
      delay: Math.random() * 3,
      duration: 1.8 + Math.random() * 2.2,
      opacity: 0.35 + Math.random() * 0.5,
    })),
    []
  );

  // Remove crowns/gems to keep the scene clean
  const floatingElements: [] = [];

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

      {/* No decorative crowns/gems */}

      {/* Dot stars that blink */}
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
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, 1, star.opacity],
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

      {/* Bottom twin-point red-black pennant */}
      <motion.div
        className="absolute left-1/2 bottom-0"
        style={{ transform: 'translateX(-50%)', pointerEvents: 'none' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="520" height="140" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="redBlack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c40000"/>
              <stop offset="55%" stopColor="#6e0000"/>
              <stop offset="100%" stopColor="#0a0a0a"/>
            </linearGradient>
          </defs>
          <path d="M10 0 H510 V80 L455 120 L400 80 L345 120 L290 80 L235 120 L180 80 L125 120 L70 80 L10 120 Z" fill="url(#redBlack)" stroke="#1a0000" strokeWidth="3"/>
          <rect x="10" y="0" width="500" height="10" fill="#000" opacity="0.6"/>
        </svg>
      </motion.div>

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

      {/* No extra particle effects */}
    </div>
  );
}


