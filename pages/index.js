import Head from 'next/head';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSectionPro from '../components/HeroSectionPro';
import PromoMarquee from '../components/PromoMarquee';
import StatCounters from '../components/StatCounters';
import FlashDeal from '../components/FlashDeal';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Users, MapPin, Clock } from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites] = useState([]);

  const stats = [
    { number: '50K+', label: 'Mutlu Müşteri', icon: Users },
    { number: '100+', label: 'Şube', icon: MapPin },
    { number: '15+', label: 'Yıllık Deneyim', icon: Award },
    { number: '30dk', label: 'Ortalama Teslimat', icon: Clock },
  ];

  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Müşteri',
      content: 'Gerçekten harika pizzalar! Özellikle Margherita favorim. Hızlı teslimat ve sıcak servis.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Ayşe Demir',
      role: 'Müşteri',
      content: 'En taze malzemelerle hazırlanan pizzalar. Ailemle her hafta sipariş veriyoruz.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Müşteri',
      content: 'Mükemmel lezzet ve kalite. Özellikle özel sosları çok beğeniyorum.',
      rating: 5,
      avatar: '👨‍🍳'
    }
  ];

  // Sample products data
  const products = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Domates sosu, mozzarella peyniri, fesleğen',
      price: 45,
      originalPrice: 55,
      image: '/pizzas/margherita.png',
      category: 'pizzas',
      rating: 4.8,
      reviewCount: 124,
      isPopular: true,
      isVegetarian: true
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Domates sosu, mozzarella, pepperoni',
      price: 55,
      image: '/pizzas/pepperoni.png',
      category: 'pizzas',
      rating: 4.7,
      reviewCount: 98,
      isPopular: true
    },
    {
      id: '3',
      name: 'Supreme Pizza',
      description: 'Domates sosu, mozzarella, sosis, mantar, biber',
      price: 65,
      image: '/pizzas/supreme.png',
      category: 'pizzas',
      rating: 4.9,
      reviewCount: 156,
      isPopular: true
    },
    {
      id: '4',
      name: 'Vegetarian Pizza',
      description: 'Domates sosu, mozzarella, sebzeler',
      price: 50,
      image: '/pizzas/vegetarian.png',
      category: 'pizzas',
      rating: 4.6,
      reviewCount: 87,
      isVegetarian: true
    },
    {
      id: '5',
      name: 'BBQ Chicken Pizza',
      description: 'BBQ sosu, tavuk, soğan, mısır',
      price: 60,
      image: '/pizzas/bbq-chicken.png',
      category: 'pizzas',
      rating: 4.5,
      reviewCount: 73
    },
    {
      id: '6',
      name: 'Mexican Hot Pizza',
      description: 'Acılı sos, jalapeño, mısır',
      price: 65,
      image: '/pizzas/mexican-hot.png',
      category: 'pizzas',
      rating: 4.4,
      reviewCount: 45,
      isSpicy: true
    },
    
  ];

  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Cart functions
  const addToCart = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToFavorites = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleQuickView = (productId) => {
    // Implement quick view modal
    // console.log('Quick view:', productId);
  };

  const handleCheckout = () => {
    // Implement checkout process
    // console.log('Checkout with items:', cartItems);
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <>
      <Head>
        <title>Pizza Palace Pro - Türkiye'nin En Lezzetli Pizzaları</title>
        <meta name="description" content="Türkiye'nin en lezzetli pizzalarını keşfedin. Taze malzemeler, özel soslar ve mükemmel pişirme tekniği ile Pizza Palace Pro." />
        <meta name="keywords" content="pizza, pizza palace, türkiye pizza, lezzetli pizza, online pizza sipariş, pizza teslimat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pizza Palace" />
        <link rel="apple-touch-icon" href="/Pizza Krallığı Logosu.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Pizza Palace Pro" />
        <meta property="og:description" content="Türkiye'nin en lezzetli pizzalarını keşfedin" />
        <meta property="og:image" content="/Pizza Krallığı Logosu.png" />
        <meta property="og:url" content="https://pizza-palace-erp-qc8j.vercel.app/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pizza Palace Pro" />
        <meta name="twitter:description" content="Türkiye'nin en lezzetli pizzalarını keşfedin" />
        <meta name="twitter:image" content="/Pizza Krallığı Logosu.png" />
      </Head>

      <Navigation />
      <PromoMarquee />

      <main className="min-h-screen pt-32">
        <HeroSectionPro />
        <FlashDeal />
        
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <StatCounters />
          </div>
        </section>

        {/* Menu Section with Category Filter */}
        <section id="menu-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                🍕 Lezzetli Menümüz
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                En taze malzemelerle hazırlanan özel pizzalarımızı keşfedin. 
                Her bir pizza, ustalarımızın özenle seçtiği malzemelerle hazırlanır.
              </p>
            </motion.div>
            
            {/* Category Filter */}
            <CategoryFilter
              onCategoryChange={setActiveCategory}
              activeCategory={activeCategory}
              className="mb-12"
            />
            
            {/* Products Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="wait">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onAddToFavorites={addToFavorites}
                      onQuickView={handleQuickView}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mt-12"
              >
                <button className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg">
                  Daha Fazla Göster
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                🚀 Neden Pizza Palace Pro?
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
              >
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hızlı Teslimat</h3>
                <p className="text-gray-600">30 dakika içinde kapınızda, aksi takdirde ücretsiz!</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-8 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
              >
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Kalite</h3>
                <p className="text-gray-600">En taze malzemeler ve özel tariflerle hazırlanır.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-8 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Modern Teknoloji</h3>
                <p className="text-gray-600">3D animasyonlar ve modern web teknolojileri.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                💬 Müşteri Yorumları
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Müşterilerimizin deneyimlerini dinleyin
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">&quot;{testimonial.content}&quot;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-red-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                🍕 Hemen Sipariş Verin!
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Türkiye&apos;nin en lezzetli pizzalarını keşfetmek için hemen sipariş verin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  onClick={() => setIsCartOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Sepete Git
                </motion.button>
                <motion.button 
                  onClick={() => setActiveCategory('pizzas')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
                >
                  Menüyü Görüntüle
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </>
  );
} 