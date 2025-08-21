import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Shield, Zap, Heart, ShoppingCart, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

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
              <a href="/profile" className="text-red-400 hover:text-red-300 transition-colors">Profilim</a>
              {isAuthed ? (
                <button onClick={handleLogout} className="px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors">Çıkış Yap</button>
              ) : (
                <Link href="/login" className="px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors">Giriş Yap</Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthed ? (
                <Link href="/login" className="hidden sm:inline-flex px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors">Giriş Yap</Link>
              ) : (
                <button onClick={handleLogout} className="hidden sm:inline-flex px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors">Çıkış Yap</button>
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
                <a href="/profile" className="text-red-400 hover:text-red-300 transition-colors">Profilim</a>
                {!isAuthed ? (
                  <Link href="/login" className="px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors w-max">Giriş Yap</Link>
                ) : (
                  <button onClick={handleLogout} className="px-4 py-2 border-2 border-red-600 text-red-500 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors w-max">Çıkış Yap</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Royal Parallax */}
      <section className="relative min-h-[80vh] flex items-start justify-center pt-44 overflow-hidden">
        <RoyalParallaxScene disableContentParallax>
          <div className="relative z-20 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8 mt-24"
            >
              <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-6xl md:text-8xl font-extrabold mb-2 mt-8">
                <span className="text-red-700">Pizza</span> <span className="text-black">Krallığı</span>
              </h1>
              <p className="text-base md:text-lg mb-6 text-gray-200 max-w-2xl mx-auto">
                Pizza Krallığı, seçkin malzemeler ve usta şeflerin reçeteleriyle premium bir lezzet deneyimi sunar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg bg-red-600 text-white hover:bg-red-700"
              >
                Menüyü Keşfet
              </button>
              <button type="button"
                onClick={() => setIsVideoPlaying(true)}
                className="px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 border-2 border-black text-black hover:bg-black hover:text-white"
              >
                Video İzle
              </button>
            </motion.div>
          </div>
        </RoyalParallaxScene>
      </section>
      {/* Video Modal */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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

      {/* Royal Features */}
      <section className="py-20" style={{background: '#120006'}}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              👑 Kraliyet Özelliklerimiz
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Crown, title: 'Premium Kalite', desc: 'En kaliteli malzemeler ve özel tarifler' },
              { icon: Shield, title: 'Güvenli Teslimat', desc: '30 dakika içinde kapınızda' },
              { icon: Zap, title: 'Hızlı Servis', desc: 'Modern teknoloji ile hızlı hazırlık' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-yellow-400/30"
              >
                <feature.icon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Royal Menu */}
      <section id="menu" className="py-20" style={{background: '#0b0003'}}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              👑 Kraliyet Menümüz
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Her biri özenle hazırlanan premium pizzalarımızı keşfedin
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-yellow-400/30 overflow-hidden hover:transform hover:scale-105 transition-all"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                      {product.badge}
                    </div>
                  )}
                  {product.isPremium && (
                    <div className="absolute top-4 right-4">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white ml-1">{product.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-yellow-400">
                        ₺{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through">
                          ₺{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-4 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-yellow-500 transition-all"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Royal Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-purple-900 to-red-900 border-l-2 border-yellow-400"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Kraliyet Sepeti</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-white hover:text-yellow-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Sepetiniz boş</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-white/10 rounded-lg p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{item.name}</h4>
                            <p className="text-yellow-400 font-bold">₺{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-yellow-400/30 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white text-lg">Toplam:</span>
                        <span className="text-yellow-400 text-2xl font-bold">₺{totalPrice}</span>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 py-3 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-yellow-500 transition-all">
                        Siparişi Tamamla
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 