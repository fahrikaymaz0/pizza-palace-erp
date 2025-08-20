'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Star, Clock, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import OptimizedImage from './OptimizedImage';
import CheeseDrip from './CheeseDrip';

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

const PIZZA_IMAGES = [
  '/pizzas/margherita.png',
  '/pizzas/pepperoni.png',
  '/pizzas/supreme.png',
  '/pizzas/vegetarian.png',
];

export default function HeroSectionPro({ className }: HeroSectionProProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // removed rotating images

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
      {/* SVG tabanlı akışkan damlama */}
      <CheeseDrip />
      

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6"
            >
              <span className="text-red-600">Pizza</span> Krallığı
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed"
            >
              Türkiye'nin en lezzetli pizzalarını keşfedin. 
              Taze malzemeler, özel soslar ve mükemmel pişirme tekniği.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
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

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm"
                >
                  <feature.icon className={cn('w-8 h-8 mx-auto mb-2', feature.color)} />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
        </motion.div>
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
                <source src="/pizzaanasayfa.mp4" type="video/mp4" />
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
