import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Shield, Zap, Heart, ShoppingCart, Menu, X, ChevronRight, ChevronLeft, Phone, Award, Clock, Truck } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load components for better performance
const FastHeroSection = dynamic(() => import('../components/FastHeroSection'), {
  loading: () => <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50" />
});
const ModernProductCard = dynamic(() => import('../components/ModernProductCard'), {
  loading: () => <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
});
const CartSidebar = dynamic(() => import('../components/CartSidebar'), {
  ssr: false
});

export default function RoyalPizzaKingdom() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

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
    },
    {
      id: '3',
      name: 'Supreme Majesty',
      description: 'Kraliyet malzemeleri: sosis, mantar, biber, soğan, zeytin',
      price: 129,
      image: '/pizzas/supreme.png',
      category: 'supreme',
      rating: 5.0,
      reviewCount: 312,
      isPremium: true,
      badge: '👑 Majeste'
    },
    {
      id: '4',
      name: 'Royal Vegetarian',
      description: 'Taze sebzeler, mozzarella, parmesan, fesleğen',
      price: 79,
      image: '/pizzas/vegetarian.png',
      category: 'royal',
      rating: 4.7,
      reviewCount: 145,
      isVegetarian: true,
      badge: '🌿 Kraliyet'
    },
    {
      id: '5',
      name: 'BBQ Royal Chicken',
      description: 'BBQ sosu, tavuk göğsü, soğan, mısır, mozzarella',
      price: 109,
      image: '/pizzas/bbq-chicken.png',
      category: 'bbq',
      rating: 4.6,
      reviewCount: 98,
      badge: '🍗 Kraliyet'
    },
    {
      id: '6',
      name: 'Mexican Fire',
      description: 'Acılı sos, jalapeño, mısır, tavuk, mozzarella',
      price: 119,
      image: '/pizzas/mexican-hot.png',
      category: 'spicy',
      rating: 4.5,
      reviewCount: 87,
      isSpicy: true,
      badge: '🔥 Ateş'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '👑' },
    { id: 'royal', name: 'Kraliyet', icon: '👑' },
    { id: 'imperial', name: 'İmparatorluk', icon: '⚔️' },
    { id: 'supreme', name: 'Majeste', icon: '👑' },
    { id: 'bbq', name: 'BBQ', icon: '🍗' },
    { id: 'spicy', name: 'Acılı', icon: '🔥' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? royalProducts 
    : royalProducts.filter(product => product.category === activeCategory);

  const addToCart = (product) => {
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
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthed(!!token);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthed(false);
      window.location.href = '/';
    }
  };

  return (
    <>
      <Head>
        <title>Pizza Krallığı - Kraliyet Lezzetlerin Adresi</title>
        <meta name="description" content="Pizza Krallığı'nda kraliyet lezzetlerini keşfedin. Premium malzemeler, özel tarifler ve eşsiz deneyim." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      {/* Royal Navigation (siyah/koyu kırmızı) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-red-700/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-500">Pizza Krallığı</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#menu" className="text-red-400 hover:text-red-300 transition-colors">Menü</a>
              <a href="#about" className="text-red-400 hover:text-red-300 transition-colors">Hakkımızda</a>
              <a href="#contact" className="text-red-400 hover:text-red-300 transition-colors">İletişim</a>
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
                className="relative p-2 text-red-500 hover:text-red-400 transition-colors"
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
                className="md:hidden text-red-500"
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
            className="fixed top-20 left-0 right-0 z-40 bg-black/90 border-b border-red-700/60 md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#menu" className="text-red-400 hover:text-red-300 transition-colors">Menü</a>
                <a href="#about" className="text-red-400 hover:text-red-300 transition-colors">Hakkımızda</a>
                <a href="#contact" className="text-red-400 hover:text-red-300 transition-colors">İletişim</a>
                {isAuthed && (
                  <a href="/profile" className="text-red-400 hover:text-red-300 transition-colors">Profilim</a>
                )}
                {!isAuthed ? (
                  <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 rounded-full font-semibold hover:from-green-200 hover:to-teal-200 transition-all duration-300 shadow-sm w-max">Giriş Yap</Link>
                ) : (
                  <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-full font-semibold hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-sm w-max">Çıkış Yap</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fast Hero Section - No Images */}
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50" />}>
        <FastHeroSection />
      </Suspense>


      {/* Modern Features */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Neden <span className="text-red-600">Pizza Krallığı</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Müşterilerimize en iyi deneyimi sunmak için sürekli kendimizi geliştiriyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: '30dk Teslimat', desc: 'Hızlı ve zamanında teslimat garantisi', color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-100' },
              { icon: Crown, title: 'Premium Kalite', desc: 'En taze malzemeler ve özel tarifler', color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-yellow-100' },
              { icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme ile güvenli alışveriş', color: 'text-sky-600', bg: 'bg-gradient-to-br from-sky-50 to-blue-100' },
              { icon: Award, title: 'Ödüllü Lezzet', desc: 'Sektörde 15+ yıllık deneyim ve kalite', color: 'text-violet-600', bg: 'bg-gradient-to-br from-violet-50 to-purple-100' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group text-center p-8 ${feature.bg} rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Menu */}
      <section id="menu-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lezzet <span className="text-red-600">Menümüz</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Özenle seçilmiş malzemeler ve usta şeflerin deneyimi ile hazırlanan pizzalarımız
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-yellow-400 text-purple-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Suspense key={product.id} fallback={<div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />}>
                <ModernProductCard
                  product={{
                    ...product,
                    preparationTime: 15 + Math.floor(Math.random() * 10), // 15-25 dk
                  }}
                  onAddToCart={addToCart}
                  delay={index * 0.1}
                />
              </Suspense>
            ))}
          </div>

          {/* View All Menu Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Tüm Menüyü Görüntüle
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modern Cart Sidebar */}
      <Suspense fallback={null}>
        {isCartOpen && (
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            totalPrice={totalPrice}
          />
        )}
      </Suspense>

      {/* Quick Contact Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Link
          href="tel:+905551234567"
          className="group flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-green-600"
        >
          <Phone className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-semibold hidden sm:block">Hızlı Sipariş</span>
        </Link>
      </motion.div>
    </>
  );
} 