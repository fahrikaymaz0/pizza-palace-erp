'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Shield, Award, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '../lib/base64Images';

interface FastHeroSectionProps {
  className?: string;
}

export default function FastHeroSection({ className }: FastHeroSectionProps) {
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
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 ${className}`}
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

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left lg:pr-8"
          >
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 mb-6"
            >
              <Star className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-red-600 font-semibold text-sm">Türkiye'nin #1 Pizza Markası</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-red-600">Pizza</span>{' '}
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Krallığı</span>
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
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg"
            >
              Premium malzemeler, özel soslar ve usta şeflerin deneyimi ile hazırlanan lezzetleri keşfedin.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
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

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"
                >
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="text-gray-700 text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Pizza showcase with base64 images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Pizza showcase with floating effect */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-80 h-80 lg:w-96 lg:h-96"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.1, opacity: 0, rotate: 10 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
                >
                  <Image
                    src={pizzaSlides[currentSlide].image}
                    alt={pizzaSlides[currentSlide].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 320px, 384px"
                    priority={currentSlide === 0}
                    placeholder="blur"
                    blurDataURL={placeholderImages.pizza}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = pizzaSlides[currentSlide].fallback;
                    }}
                  />
                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${pizzaSlides[currentSlide].color} opacity-20 blur-sm`}
                    animate={{
                      scale: [0.95, 1.05, 0.95],
                      opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Pizza info card */}
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 text-lg text-center">
                  {pizzaSlides[currentSlide].title}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 text-sm ml-2">4.9</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Slide indicators */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
              {pizzaSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-red-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick contact floating button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <Link
          href="tel:+905551234567"
          className="group flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-green-600"
        >
          <Phone className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-semibold">Hızlı Sipariş</span>
        </Link>
      </motion.div>

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
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <span className="text-sm mb-2 font-medium">Menüyü Keşfet</span>
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
