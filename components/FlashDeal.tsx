'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Zap } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { cn } from '../lib/utils';

function Countdown({ initial }: { initial: number }) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setLeft(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((left % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (left % 60).toString().padStart(2, '0');
  return (
    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
      <Zap className="w-4 h-4 animate-pulse" />
      <span className="font-mono font-bold text-sm">{h}:{m}:{s}</span>
    </div>
  );
}

const DEALS = [
  {
    id: 1,
    badge: 'EN ÇOK SATAN',
    title: 'Mega Combo',
    desc: '2 Orta Pizza + Patates + 2 İçecek',
    price: 99.9,
    old: 149.9,
    discount: 33,
    image: '/pizzas/pepperoni.png',
  },
  {
    id: 2,
    badge: 'YENİ',
    title: 'Premium Duo',
    desc: '2 Büyük Pizza + Garlic Bread + 1.5L',
    price: 129.9,
    old: 189.9,
    discount: 32,
    image: '/pizzas/supreme.png',
  },
  {
    id: 3,
    badge: 'ÖZEL FİYAT',
    title: 'Aile Paketi',
    desc: '3 Orta Pizza + 3 İçecek + Patates',
    price: 159.9,
    old: 229.9,
    discount: 30,
    image: '/pizzas/margherita.png',
  },
];

export default function FlashDeal({ className }: { className?: string }) {
  return (
    <section id="deals" className={cn('py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Flash İndirim
            </h2>
            <p className="text-gray-600 mt-2">Süre dolmadan yakala!</p>
          </div>
          <Countdown initial={3600} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DEALS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-red-100"
            >
              <div className="relative h-48">
                <OptimizedImage src={d.image} alt={d.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {d.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">%{d.discount} İndirim</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{d.title}</h3>
                <p className="text-gray-600 mb-4">{d.desc}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-red-600">₺{d.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through">₺{d.old.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <Truck className="w-4 h-4 mr-1" /> Ücretsiz Teslimat
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors">
                  Sepete Ekle
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


