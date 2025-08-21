'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Star, Clock, Truck, ShieldCheck, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import RoyalPizzaBackground from './RoyalPizzaBackground';
import RoyalParallaxScene from './RoyalParallaxScene';

interface HeroSectionProProps {
  className?: string;
}

const FEATURES = [
  {
    icon: Clock,
    title: 'Hızlı Teslimat',
    description: '30 dakika içinde kapınızda',
    color: 'text-green-500',
  },
  {
    icon: Star,
    title: 'Premium Kalite',
    description: 'En taze malzemeler',
    color: 'text-yellow-500',
  },
  {
    icon: Truck,
    title: 'Ücretsiz Kargo',
    description: '50₺ üzeri siparişlerde',
    color: 'text-blue-500',
  },
];

// vitrin resmi kaldırıldı

export default function HeroSectionPro({ className }: HeroSectionProProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // removed rotating images

  // Hafif, premium bokeh partikülleri (performans dostu)
  const bokehDots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: 8 + Math.random() * 84,
        top: 10 + Math.random() * 60,
        size: 10 + Math.random() * 22,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 4,
        opacity: 0.06 + Math.random() * 0.08,
      })),
    []
  );

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('hero-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50',
        className
      )}
    >

      {/* Profesyonel arkaplan katmanları (hafif ve performanslı) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Tree/3D yerine: Canvas arkaplanı geçici olarak devre dışı bırakıyorum */}
        {/* <PremiumCanvasBG className="absolute inset-0" /> */}
        <RoyalParallaxScene />
        {/* Üst merkez yumuşak ışık vurgusu */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '60vmin',
            height: '60vmin',
            background:
              'radial-gradient(circle at center, rgba(255, 193, 7, 0.35), rgba(255, 193, 7, 0.15) 45%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />

        {/* İnce konik halkalar kaldırıldı: daha sakin ve premium görünüm */}

        {/* Nabız etkisi: yumuşak sarı halo soluk alır gibi */}
        <motion.div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '58vmin',
            height: '58vmin',
            background:
              'radial-gradient(circle at center, rgba(255, 193, 7, 0.14), rgba(255, 193, 7, 0.06) 50%, transparent 70%)',
            filter: 'blur(6px)',
          }}
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Yumuşak vinyet ve köşe aksanları */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1200px circle at 50% 15%, rgba(255, 160, 0, 0.12), transparent 60%)',
          }}
        />
        <div
          className="absolute -top-24 -left-24 rounded-full"
          style={{
            width: '42vmax',
            height: '42vmax',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255, 111, 0, 0.12), transparent 60%)',
            filter: 'blur(22px)',
          }}
        />
        <div
          className="absolute -bottom-28 -right-24 rounded-full"
          style={{
            width: '46vmax',
            height: '46vmax',
            background:
              'radial-gradient(circle at 70% 70%, rgba(255, 61, 0, 0.10), transparent 60%)',
            filter: 'blur(24px)',
          }}
        />

        {/* Premium bokeh partikülleri (yumuşak ve hareketli) */}
        {bokehDots.map((dot, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: `${dot.size}vmin`,
              height: `${dot.size}vmin`,
              background:
                'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.35), rgba(255, 193, 7, 0.22) 40%, rgba(255, 160, 0, 0.10) 70%, transparent 75%)',
              filter: 'blur(8px)',
              opacity: dot.opacity,
            }}
            initial={{ y: 0, scale: 1, opacity: dot.opacity }}
            animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Eski boncuk ve halka efektleri kaldırıldı */}
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-24">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Halka kaldırıldı */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-red-600">Pizza</span> Krallığı
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Türkiye'nin en lezzetli pizzalarını keşfedin. Taze malzemeler, özel soslar ve mükemmel pişirme tekniği.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-10 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToMenu}
                className="px-8 py-4 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Menüyü Görüntüle
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-full font-semibold text-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Video İzle
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Güvenli Ödeme</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-700">Ödüllü Lezzet</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">30dk Teslimat</span>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToMenu}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <span className="text-sm mb-2">Menüyü Keşfet</span>
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Video Modal - yalnız açıldığında yüklenir, poster ve lazy config ile */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideoLoading && (
                <div className="absolute inset-0 grid place-items-center bg-black/30 rounded-lg">
                  <div className="h-10 w-10 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <video
                className="w-full h-full object-cover rounded-lg"
                controls
                autoPlay
                playsInline
                preload="none"
                poster="/pizzas/margherita.png"
                muted
                controlsList="nodownload noplaybackrate"
                onCanPlay={() => setIsVideoLoading(false)}
                onLoadStart={() => setIsVideoLoading(true)}
              >
                <source src="/pizzaanasayfa2.mp4" type="video/mp4" />
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
              
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
