'use client';

import { motion } from 'framer-motion';

interface FlagBannerProps {
  side: 'left' | 'right';
  color: 'red' | 'yellow';
  delay?: number;
}

export default function FlagBanner({ side, color, delay = 0 }: FlagBannerProps) {
  const isLeft = side === 'left';
  const isRed = color === 'red';

  const flagColors = {
    red: 'from-red-600 via-red-500 to-red-700',
    yellow: 'from-yellow-500 via-yellow-400 to-yellow-600'
  };

  return (
    <motion.div
      initial={{ 
        x: isLeft ? -50 : 50, 
        opacity: 0
      }}
      animate={{ 
        x: 0, 
        opacity: 1
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: 'easeOut'
      }}
      className={`fixed top-0 ${isLeft ? 'left-0' : 'right-0'} z-10 h-24 ${isLeft ? 'w-24' : 'w-24'}`}
    >
      {/* Flama Ana Gövdesi */}
      <div className="relative">
        {/* Basit Flama - Köşede */}
        <div className={`
          w-20 h-16 bg-gradient-to-br ${flagColors[color]}
          ${isLeft ? 'rounded-br-lg' : 'rounded-bl-lg'}
          shadow-lg
        `}>
        </div>
      </div>
    </motion.div>
  );
}
