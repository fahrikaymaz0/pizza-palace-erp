'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface PromoMarqueeProps {
  className?: string;
}

const ITEMS = [
  { text: '30 DK’DA TESLİMAT', color: 'from-red-500 to-orange-500' },
  { text: 'SICAK GELMEZSE ÜCRETSİZ', color: 'from-yellow-500 to-red-500' },
  { text: '2 AL 1 ÖDE', color: 'from-pink-500 to-fuchsia-500' },
  { text: 'GLUTENSİZ SEÇENEKLER', color: 'from-emerald-500 to-teal-500' },
  { text: 'VEGAN MENÜ', color: 'from-blue-500 to-cyan-500' },
];

export default function PromoMarquee({ className }: PromoMarqueeProps) {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className={cn('relative w-full overflow-hidden py-3 bg-white/40 backdrop-blur-md', className)}>
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'px-4 py-1 rounded-full text-white text-sm font-semibold shadow-md bg-gradient-to-r',
              item.color
            )}
          >
            {item.text}
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/80" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/80" />
    </div>
  );
}





