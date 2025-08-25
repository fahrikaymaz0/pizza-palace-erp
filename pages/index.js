import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Shield, Zap, Heart, ShoppingCart, Menu, X, ChevronRight, ChevronLeft, Phone, Award, Clock, Truck, Crown, UserPlus, ShoppingBag, Truck as TruckIcon } from 'lucide-react';
import { useTheme } from '../context/DarkModeContext';
import OutlineCrown from '../components/OutlineCrown';
import RoyalCrown from '../components/RoyalCrown';
import Lottie from 'lottie-react';

export default function RoyalPizzaKingdom() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const { isLightMode } = useTheme();
  
  // Refs for cleanup
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const royalProducts = [
    {
      id: '1',
      name: 'Royal Margherita',
      description: 'Kraliyet domates sosu, mozzarella di bufala, taze fesleğen',
      price: 89,
      originalPrice: 120,
      image: '/pizzas/margherita.png',
      category: 'royal',
      rating: 4.9,
      reviewCount: 256,
      isPremium: true,
      isVegetarian: true,
      badge: '👑 Kraliyet'
    },
    {
      id: '2',
      name: 'Imperial Pepperoni',
      description: 'Özel pepperoni, mozzarella, parmesan peyniri',
      price: 99,
      image: '/pizzas/pepperoni.png',
      category: 'imperial',
      rating: 4.8,
      reviewCount: 189,
      isPremium: true,
      badge: '⚔️ İmparatorluk'
    }
  ];

  const addToCart = useCallback((product) => {
    if (!mountedRef.current) return;
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    if (!mountedRef.current) return;
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (!mountedRef.current) return;
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Slide değişimi için useEffect - güvenli cleanup
  useEffect(() => {
    if (!mountedRef.current) return;
    
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % 3);
      }
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Auth kontrolü için useEffect - güvenli
  useEffect(() => {
    if (!mountedRef.current) return;
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (mountedRef.current) {
        setIsAuthed(!!token);
      }
    }
  }, []);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleLogout = useCallback(() => {
    if (!mountedRef.current) return;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (mountedRef.current) {
        setIsAuthed(false);
      }
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pizza Krallığı - Kraliyet Lezzetlerin Adresi</title>
        <meta name="description" content="Pizza Krallığı'nda kraliyet lezzetlerini keşfedin. Premium malzemeler, özel tarifler ve eşsiz deneyim." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Royal Navigation - Light Mode Only */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-none border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <OutlineCrown className="w-7 h-7 text-yellow-600" />
              <h1 className="text-2xl font-bold">
                <span className="text-red-600">Pizza</span>{' '}
                <span className="text-yellow-600">Krallığı</span>
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/menu" className="text-gray-700 hover:text-red-600 transition-colors">Menü</Link>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">Hakkımızda</a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">İletişim</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Profilim butonu - auth olunca göster */}
              {isAuthed && (
                <Link href="/profile" className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-semibold hover:from-blue-200 hover:to-purple-200 transition-all duration-300 shadow-sm">
                  Profilim
                </Link>
              )}
              
              {/* Tek auth butonu - sağda */}
              {!isAuthed ? (
                <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 rounded-full font-semibold hover:from-green-200 hover:to-teal-200 transition-all duration-300 shadow-sm">
                  Giriş Yap
                </Link>
              ) : (
                <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-full font-semibold hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-sm">
                  Çıkış Yap
                </button>
              )}
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 hover:text-red-600"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link href="/menu" className="text-gray-700 hover:text-red-600 transition-colors">Menü</Link>
                <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">Hakkımızda</a>
                <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">İletişim</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basit Hero Section + Sağ/Sol Flama */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Arka plan: pizza.jpeg soluk blur */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('/pizza.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px) opacity(0.25)'
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-white/70" />
        </div>
        {/* Sarkık flamalar */}
        <div className="absolute inset-y-0 left-4 z-10 pointer-events-none hidden sm:block">
          <svg width="90" height="100%" viewBox="0 0 90 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="leftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E63946"/>
                <stop offset="100%" stopColor="#C21D2B"/>
              </linearGradient>
            </defs>
            <path d="M0 0 H90 V760 L45 820 L0 760 Z" fill="url(#leftGrad)" stroke="#A51521" strokeWidth="3"/>
          </svg>
        </div>
        <div className="absolute inset-y-0 right-4 z-10 pointer-events-none hidden sm:block">
          <svg width="90" height="100%" viewBox="0 0 90 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD166"/>
                <stop offset="100%" stopColor="#E3B84F"/>
              </linearGradient>
            </defs>
            <path d="M90 0 H0 V760 L45 820 L90 760 Z" fill="url(#rightGrad)" stroke="#D4A63A" strokeWidth="3"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <RoyalCrown className="w-16 h-16 mx-auto mb-6 text-yellow-600" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-red-600">Pizza</span>{' '}
              <span className="text-yellow-600">Krallığı</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Kraliyet lezzetlerin adresi. Premium malzemeler, özel tarifler ve eşsiz deneyim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu" className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Menüyü Gör
              </Link>
              <Link href="/register" className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                Hemen Üye Ol ve Sipariş Ver
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Basit Ürünler Bölümü */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Önerilen Pizzalarımız
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En sevilen ve özel tariflerle hazırlanan pizza seçkilerimiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {royalProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 min-h-[48px]">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-gray-700 font-semibold">{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{product.price}₺</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{product.originalPrice}₺</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hızlı Sipariş Ver Bölümü (statik ikonlarla) */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hızlı Sipariş Ver
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3 basit adımda pizzanı kapına getir
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: 'Üye Ol', desc: 'Hızlıca hesap oluşturun ve özel fırsatlardan haberdar olun', bullet: 'Ücretsiz üyelik • Hızlı kayıt • Özel indirimler' },
              { title: 'Siparişini Oluştur', desc: 'Menümüzden istediğiniz pizzayı seçin ve özelleştirin', bullet: 'Özelleştirilebilir • Hızlı seçim • Canlı takip' },
              { title: 'Siparişin Gelsin', desc: 'Sıcacık pizzanız kapınıza kadar teslim edilir', bullet: 'Hızlı teslimat • Sıcak servis • Güvenli paketleme' },
            ].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * (i + 1) }} className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-white">
                    <Image
                      src="/pizza-slices.gif"
                      alt={step.title}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.desc}</p>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">{step.bullet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Butonu */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link 
              href="/register" 
              className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Hemen Üye Ol ve Sipariş Ver
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Buttons - Sağ Alt */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-3">
        <Link href="tel:+905551234567" className="group flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-red-700">
          <Phone className="w-5 h-5" />
          <span className="font-semibold hidden sm:block">Hızlı Sipariş</span>
        </Link>
        <Link href="#" className="group flex items-center gap-3 bg-yellow-500 text-purple-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-yellow-400">
          <Shield className="w-5 h-5" />
          <span className="font-semibold hidden sm:block">Destek Ekibi</span>
        </Link>
      </div>

      {/* Footer sadeleştirildi: koyu blok kaldırıldı, hafif tema */}
      <footer className="bg-white text-gray-700 py-10 border-t">
        <div className="container mx-auto px-4 text-center">
          <RoyalCrown className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2"><span className="text-red-600">Pizza</span> <span className="text-yellow-600">Krallığı</span></h3>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/menu" className="hover:text-red-600">Menü</Link>
            <Link href="/login" className="hover:text-red-600">Giriş</Link>
            <Link href="/register" className="hover:text-red-600">Kayıt</Link>
          </div>
        </div>
      </footer>
    </>
  );
} 