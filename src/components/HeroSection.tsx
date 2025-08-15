'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Pizza Krallığı'na Hoş Geldiniz",
      subtitle: 'En taze malzemeler, en lezzetli pizzalar',
      image: '/pizzas/margherita.png',
      bgColor: 'from-red-500 to-orange-500',
    },
    {
      title: 'Özel Tariflerimiz',
      subtitle: 'Geleneksel İtalyan lezzetleri',
      image: '/pizzas/pepperoni.png',
      bgColor: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Hızlı Teslimat',
      subtitle: '30 dakika içinde kapınızda',
      image: '/pizzas/quattro-stagioni.png',
      bgColor: 'from-yellow-500 to-red-500',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 animate-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Pizza Slices */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="text-4xl opacity-20">🍕</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <div className="mb-8">
            <Image
              src="/Pizza Krallığı Logosu.png"
              alt="Pizza Krallığı"
              width={200}
              height={80}
              className="mx-auto mb-6"
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg animate-fade-in">
            {slides[currentSlide].title}
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-shadow-md animate-fade-in-delay">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Sipariş Ver
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105">
              Menüyü Gör
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out;
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
