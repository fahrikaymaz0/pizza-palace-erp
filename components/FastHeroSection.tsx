'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Shield, Award, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { placeholderImages } from '../lib/base64Images';
import FlagBanner from './FlagBanner';
import PremiumImage from './PremiumImage';

interface FastHeroSectionProps {
  className?: string;
  isDarkMode?: boolean;
}

export default function FastHeroSection({ className, isDarkMode }: FastHeroSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pizza görselleri - base64 ile hızlı yüklenir
  const pizzaSlides = [
    {
      image: '/optimized/pizzas/margherita-large.webp',
      fallback: '/pizzas/margherita.png',
      title: 'Royal Margherita',
      subtitle: 'En taze malzemelerle hazırlanan klasik lezzet',
      color: 'from-red-500 to-orange-500'
    },
    {
      image: '/optimized/pizzas/pepperoni-large.webp',
      fallback: '/pizzas/pepperoni.png',
      title: 'Imperial Pepperoni',
      subtitle: 'Premium malzemelerle dolu kraliyet lezzeti',
      color: 'from-purple-500 to-pink-500'
    },
    {
      image: '/optimized/pizzas/supreme-large.webp',
      fallback: '/pizzas/supreme.png',
      title: 'Supreme Majesty',
      subtitle: 'Özel baharatlarla eşsiz tat deneyimi',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Trust indicators
  const trustBadges = [
    { icon: Clock, text: '30dk Teslimat', color: 'text-green-600' },
    { icon: Shield, text: 'Güvenli Ödeme', color: 'text-blue-600' },
    { icon: Award, text: 'Ödüllü Lezzet', color: 'text-yellow-600' },
    { icon: Star, text: '4.9/5 Müşteri Memnuniyeti', color: 'text-orange-600' }
  ];

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pizzaSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pizzaSlides.length]);

  // Intersection observer for animations
  useEffect(() => {
    setIsVisible(true); // Anında göster
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
      } ${className}`}
    >
      {/* Hızlı CSS animasyonlu arka plan - görsel yok */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(245, 101, 101, 0.15), transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(251, 146, 60, 0.1), transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1), transparent 50%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Floating elements - sadece CSS shapes */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-red-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 bg-orange-200 rounded-full opacity-25"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-14 bg-yellow-200 rounded-full opacity-20"
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Flag Banners */}
      <FlagBanner side="left" color="red" delay={0.5} />
      <FlagBanner side="right" color="yellow" delay={0.7} />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-24">
        <div className="text-center min-h-[80vh] flex flex-col justify-center">
          {/* Center Content - Logo and Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Crown Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <span className="text-6xl">👑</span>
            </motion.div>

            {/* Main Heading - Centered */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="text-red-600 dark:text-red-400">Pizza</span>{' '}
              <span className="text-yellow-500 dark:text-yellow-400">Krallığı</span>
            </motion.h1>

            {/* Dynamic subtitle based on current slide */}
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed"
            >
              {pizzaSlides[currentSlide].subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              Premium malzemeler, özel soslar ve usta şeflerin deneyimi ile hazırlanan lezzetleri keşfedin.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToMenu}
                className="group px-8 py-4 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Menüyü Keşfet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
                className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-full font-semibold text-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Video İzle
              </motion.button>
            </motion.div>


          </motion.div>
        </div>
      </div>

      {/* Floating Action Buttons - Sadece Sağ Taraf */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-3">
        {/* Destek Butonu */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <Link
            href="#"
            className="group flex items-center gap-2 sm:gap-3 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-600"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base hidden sm:block">Destek Ekibi</span>
          </Link>
        </motion.div>

        {/* Hızlı Sipariş Butonu */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <Link
            href="tel:+905551234567"
            className="group flex items-center gap-2 sm:gap-3 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-green-600"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Hızlı Sipariş</span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
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
          className={`flex flex-col items-center transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-red-400' 
              : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Simple Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster="/pizzas/margherita.png"
              >
                <source src="/pizzaanasayfa2.mp4" type="video/mp4" />
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
              
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -top-12 -right-12 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
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
