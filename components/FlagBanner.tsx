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
        x: isLeft ? -100 : 100, 
        opacity: 0,
        rotate: isLeft ? -5 : 5
      }}
      animate={{ 
        x: 0, 
        opacity: 1,
        rotate: 0
      }}
      transition={{ 
        duration: 1.2, 
        delay,
        type: 'spring',
        damping: 20
      }}
      className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} z-30`}
    >
      {/* Flama Ana Gövdesi */}
      <div className="relative">
        {/* Flama Kumaşı */}
        <div className={`
          relative h-48 w-32 bg-gradient-to-br ${flagColors[color]}
          shadow-2xl transform ${isLeft ? 'origin-top-left' : 'origin-top-right'}
        `}>
          {/* Flama Sivri Ucu */}
          <div 
            className={`
              absolute bottom-0 ${isLeft ? 'right-0' : 'left-0'}
              w-0 h-0 border-solid
              ${isLeft 
                ? `border-l-[32px] border-l-transparent 
                   border-t-[20px] ${isRed ? 'border-t-red-700' : 'border-t-yellow-600'}`
                : `border-r-[32px] border-r-transparent 
                   border-t-[20px] ${isRed ? 'border-t-red-700' : 'border-t-yellow-600'}`
              }
            `}
          />
          
          {/* Flama Üst Kısmı - Direk Bağlantısı */}
          <div className={`
            absolute top-0 ${isLeft ? 'left-0' : 'right-0'}
            w-full h-4 bg-gradient-to-r ${isRed ? 'from-red-800 to-red-900' : 'from-yellow-600 to-yellow-700'}
            border-b-2 ${isRed ? 'border-red-900' : 'border-yellow-700'}
          `} />
          
          {/* Flama Gölgesi */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-transparent via-transparent 
            ${isRed ? 'to-red-900/30' : 'to-yellow-700/30'}
          `} />
          
          {/* Flama Işık Efekti */}
          <div className={`
            absolute top-2 ${isLeft ? 'left-2' : 'right-2'} 
            w-6 h-16 bg-gradient-to-b from-white/40 to-transparent 
            blur-sm rounded-full
          `} />
        </div>

        {/* Flama Direği */}
        <div className={`
          absolute ${isLeft ? 'left-0' : 'right-0'} top-0
          w-2 h-64 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950
          shadow-lg ${isLeft ? '-translate-x-1' : 'translate-x-1'}
          rounded-sm
        `}>
          {/* Direk Metalik Efekt */}
          <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm" />
        </div>

        {/* Flama Dalgalanma Animasyonu */}
        <motion.div
          animate={{
            rotate: [0, 2, -1, 1, 0],
            scaleX: [1, 1.02, 0.98, 1.01, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Rüzgar Efekti */}
          <div className={`
            absolute top-8 ${isLeft ? 'right-1' : 'left-1'}
            w-full h-32 bg-gradient-to-r 
            ${isRed 
              ? 'from-red-400/20 to-transparent' 
              : 'from-yellow-300/20 to-transparent'
            }
            blur-sm
          `} />
        </motion.div>
      </div>
    </motion.div>
  );
}
