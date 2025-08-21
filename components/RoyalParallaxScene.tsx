'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RoyalParallaxSceneProps {
  className?: string;
  children?: React.ReactNode;
  disableContentParallax?: boolean;
}

export default function RoyalParallaxScene({ className, children, disableContentParallax }: RoyalParallaxSceneProps) {
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
    () => Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 1.3,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2.5,
      opacity: 0.25 + Math.random() * 0.4,
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
        background: 'radial-gradient(circle at 50% 40%, #1b2a44 0%, #0e1a2b 60%, #0a0f1a 100%)'
      }}
    >
      {/* Static dark background */}

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

      {/* Side long pennants (left black, right dark red) */}
      <motion.div
        className="absolute left-10 top-0 h-full"
        style={{ pointerEvents: 'none' }}
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Sol flama: üst düz, alt tek sivri uç (gönderdiğin örneğe yakın) */}
        <svg width="120" height="100%" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#151515"/>
              <stop offset="50%" stopColor="#0e0e0e"/>
              <stop offset="100%" stopColor="#000000"/>
            </linearGradient>
          </defs>
          <path d="M0 0 H120 V780 L60 840 L0 780 Z" fill="url(#blackGrad)" stroke="#000" strokeWidth="3"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-10 top-0 h-full"
        style={{ pointerEvents: 'none' }}
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        {/* Sağ flama: koyu kırmızı, tek sivri uç */}
        <svg width="120" height="100%" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="darkRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7a0000"/>
              <stop offset="50%" stopColor="#560000"/>
              <stop offset="100%" stopColor="#2a0000"/>
            </linearGradient>
          </defs>
          <path d="M120 0 H0 V780 L60 840 L120 780 Z" fill="url(#darkRedGrad)" stroke="#1a0000" strokeWidth="3"/>
        </svg>
      </motion.div>

      {/* Alt çizgiler kaldırıldı */}

      {/* No central aura for a cleaner dark look */}

      {/* Parallax Content */}
      <motion.div
        className="relative z-10 w-full h-full"
        style={disableContentParallax ? undefined : {
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      >
        {children}
      </motion.div>

      {/* No extra particle effects */}
    </div>
  );
}


