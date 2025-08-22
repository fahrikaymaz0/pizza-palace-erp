'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Award, Clock } from 'lucide-react';

const STATS = [
  { icon: Users, label: 'Mutlu Müşteri', target: 50000 },
  { icon: MapPin, label: 'Şube', target: 120 },
  { icon: Award, label: 'Yıllık Deneyim', target: 15 },
  { icon: Clock, label: 'Ortalama Teslimat', target: 30, suffix: 'dk' },
];

export default function StatCounters() {
  const [values, setValues] = useState(STATS.map(() => 0));

  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const anim = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setValues(
        STATS.map(s => Math.floor((s.target * (1 - Math.cos(Math.PI * t))) / 2))
      );
      if (t < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="text-center"
        >
          <div className="flex justify-center mb-3">
            <s.icon className="w-10 h-10 text-red-600" />
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {values[i].toLocaleString('tr-TR')}
            {s.suffix ? s.suffix : '+'}
          </div>
          <div className="text-gray-600 font-medium">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}





