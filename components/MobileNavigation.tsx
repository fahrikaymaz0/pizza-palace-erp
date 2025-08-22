'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, UtensilsCrossed, Phone, User, ShoppingCart, Crown } from 'lucide-react';
import Link from 'next/link';

interface MobileNavigationProps {
  cartItemsCount?: number;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function MobileNavigation({ 
  cartItemsCount = 0, 
  isAuthenticated = false,
  onLogout 
}: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to change nav appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/menu', label: 'Menü', icon: UtensilsCrossed },
    { href: '/stores', label: 'Mağazalar', icon: Phone },
    { href: '/profile', label: 'Profilim', icon: User, authRequired: true },
  ];

  return (
    <>
      {/* Mobile Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="safe-top">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Crown className="w-7 h-7 text-red-600" />
              <span className="font-bold text-lg text-gray-900">Pizza Krallığı</span>
            </Link>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors touch-manipulation tap-highlight-none"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </motion.span>
                )}
              </Link>

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-red-600 transition-colors touch-manipulation tap-highlight-none"
                aria-label="Menüyü aç/kapat"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="safe-top h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-red-600" />
                    <span className="font-bold text-xl text-gray-900">Menü</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6">
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      if (item.authRequired && !isAuthenticated) return null;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 touch-manipulation"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Divider */}
                  <div className="mx-6 my-6 border-t border-gray-200" />

                  {/* Auth Section */}
                  <div className="px-6 space-y-3">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          onLogout?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-3 px-4 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all touch-manipulation"
                      >
                        Çıkış Yap
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full py-3 px-4 bg-red-600 text-white text-center rounded-full font-semibold hover:bg-red-700 transition-colors touch-manipulation"
                        >
                          Giriş Yap
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full py-3 px-4 border-2 border-red-600 text-red-600 text-center rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all touch-manipulation"
                        >
                          Üye Ol
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="safe-bottom p-6 border-t border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Sipariş Hattı
                    </p>
                    <Link
                      href="tel:+905551234567"
                      className="text-lg font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      0555 123 45 67
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-bottom">
        <div className="grid grid-cols-4 gap-1">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-3 px-2 text-gray-600 hover:text-red-600 transition-colors touch-manipulation tap-highlight-none"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 lg:hidden" />
      <div className="h-16 lg:hidden" /> {/* Bottom nav spacer */}
    </>
  );
}
