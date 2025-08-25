'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X, Heart, MapPin, Phone } from 'lucide-react';
import RoyalCrown from './RoyalCrown';
import { cn } from '../lib/utils';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Simulated cart count
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" 
        : "bg-transparent"
    )}>
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>En yakın şube: 2.3 km</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>0850 123 45 67</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="hover:text-red-200 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="hover:text-red-200 transition-colors">
              İletişim
            </Link>
            <Link href="/franchise" className="hover:text-red-200 transition-colors">
              Franchise
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <RoyalCrown className="w-6 h-6 text-yellow-600" />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                <span className="text-red-600">Pizza</span> <span className="text-yellow-600">Krallığı</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/menu" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Menü
              </Link>
              <Link href="/campaigns" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Kampanyalar
              </Link>
              <Link href="/stores" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Şubeler
              </Link>
              <Link href="/reviews" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Yorumlar
              </Link>
              <Link href="/paytr-direkt-api" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Ödeme (Test)
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Pizza, içecek veya menü ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button (Mobile) */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites */}
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Giriş Yap
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Kayıt Ol
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profilim
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Siparişlerim
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 px-4 py-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Pizza, içecek veya menü ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200"
          >
            <div className="px-4 py-3 space-y-2">
              <Link href="/menu" className="block py-2 text-gray-700 hover:text-red-600">
                Menü
              </Link>
              <Link href="/campaigns" className="block py-2 text-gray-700 hover:text-red-600">
                Kampanyalar
              </Link>
              <Link href="/stores" className="block py-2 text-gray-700 hover:text-red-600">
                Şubeler
              </Link>
              <Link href="/reviews" className="block py-2 text-gray-700 hover:text-red-600">
                Yorumlar
              </Link>
              <Link href="/paytr-direkt-api" className="block py-2 text-gray-700 hover:text-red-600">
                Ödeme (Test)
              </Link>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-red-600">
                Hakkımızda
              </Link>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-red-600">
                İletişim
              </Link>
              <Link href="/franchise" className="block py-2 text-gray-700 hover:text-red-600">
                Franchise
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
