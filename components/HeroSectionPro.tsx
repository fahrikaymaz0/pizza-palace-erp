'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Star, Clock, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import OptimizedImage from './OptimizedImage';
import Pizza3DPro from '../src/components/Pizza3DPro';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-rotate pizza images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PIZZA_IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated background shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full opacity-20"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              <span className="text-red-600">Pizza</span> Krallığı
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Türkiye'nin en lezzetli pizzalarını keşfedin. 
              Taze malzemeler, özel soslar ve mükemmel pişirme tekniği.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
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
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
                >
                  <feature.icon className={cn('w-8 h-8 mx-auto mb-2', feature.color)} />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* 3D Pizza Animation */}
            {!isVideoPlaying && (
              <div className="relative h-96 lg:h-[500px] mb-8">
                <Pizza3DPro
                  className="w-full h-full"
                  autoPlay={true}
                  ingredientCount={8}
                  showControls={false}
                />
              </div>
            )}

            {/* Floating Pizza Images */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <OptimizedImage
                    src={PIZZA_IMAGES[currentImageIndex]}
                    alt="Pizza"
                    width={300}
                    height={300}
                    className="w-64 h-64 object-contain drop-shadow-2xl"
                    priority={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
            >
              <span className="text-2xl">🍕</span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg"
            >
              <span className="text-2xl">🧀</span>
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
