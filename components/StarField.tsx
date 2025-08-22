'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface StarFieldProps {
  isDarkMode: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationDelay: number;
  animationDuration: number;
}

const StarField: React.FC<StarFieldProps> = ({ isDarkMode }) => {
  // Optimize: Sadece 30 yıldız kullan (çok fazla olmasın)
  const stars = useMemo<Star[]>(() => {
    if (!isDarkMode) return [];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // % olarak pozisyon
      y: Math.random() * 100,
      size: 1 + Math.random() * 2, // 1-3px arası boyut
      color: Math.random() > 0.5 ? '#FEF08A' : '#F3F4F6', // Sarı veya beyaz
      animationDelay: Math.random() * 4, // 0-4 saniye arasında gecikme
      animationDuration: 2 + Math.random() * 3, // 2-5 saniye arasında animasyon süresi
    }));
  }, [isDarkMode]);

  if (!isDarkMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.animationDuration,
            delay: star.animationDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
