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
      className={`absolute ${isLeft ? 'left-10' : 'right-10'} top-0 h-full z-30`}
      style={{ pointerEvents: 'none' }}
      animate={{ x: isLeft ? [0, 4, 0] : [0, -4, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: isLeft ? 0 : 0.4 }}
    >
      {/* Aşağıya doğru uzanan flama - giriş sayfası gibi */}
      <svg width="120" height="100%" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={isLeft ? "leftFlagGrad" : "rightFlagGrad"} x1="0%" y1="0%" x2="0%" y2="100%">
            {isRed ? (
              <>
                <stop offset="0%" stopColor="#E63946"/>
                <stop offset="100%" stopColor="#C21D2B"/>
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFD166"/>
                <stop offset="100%" stopColor="#E3B84F"/>
              </>
            )}
          </linearGradient>
        </defs>
        <path 
          d={isLeft ? "M0 0 H120 V780 L60 840 L0 780 Z" : "M120 0 H0 V780 L60 840 L120 780 Z"} 
          fill={`url(#${isLeft ? "leftFlagGrad" : "rightFlagGrad"})`} 
          stroke={isRed ? "#A51521" : "#D4A63A"} 
          strokeWidth="3"
        />
      </svg>
    </motion.div>
  );
}
