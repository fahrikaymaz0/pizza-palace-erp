'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/DarkModeContext';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, ShoppingCart, ArrowLeft, Filter, Search, Heart, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import RoyalParallaxScene from '../components/RoyalParallaxScene';
import PremiumImage from '../components/PremiumImage';

function RoyalMenu() {
  const { isLightMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Statik pizza verileri
  const allProducts = [
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
      badge: '👑 Kraliyet',
      ingredients: ['Domates Sosu', 'Mozzarella', 'Fesleğen', 'Zeytinyağı'],
      preparationTime: '15-20 dk',
      calories: 850
    },
    {
      id: '2',
      name: 'Imperial Pepperoni',
      description: 'Özel pepperoni, mozzarella, parmesan peyniri',
      price: 99,
      image: '/pizzas/pepperoni.png',
      category: 'classic',
      rating: 4.8,
      reviewCount: 189,
      isPremium: true,
      badge: '⚔️ İmparatorluk',
      ingredients: ['Pepperoni', 'Mozzarella', 'Parmesan', 'Domates Sosu'],
      preparationTime: '18-22 dk',
      calories: 950
    },
    {
      id: '3',
      name: 'Supreme Majesty',
      description: 'Kraliyet malzemeleri: sosis, mantar, biber, soğan, zeytin',
      price: 129,
      image: '/pizzas/supreme.png',
      category: 'royal',
      rating: 5.0,
      reviewCount: 312,
      isPremium: true,
      badge: '👑 Majeste',
      ingredients: ['Sosis', 'Mantar', 'Biber', 'Soğan', 'Zeytin'],
      preparationTime: '20-25 dk',
      calories: 1100
    },
    {
      id: '4',
      name: 'Royal Vegetarian',
      description: 'Taze sebzeler, mozzarella, parmesan, fesleğen',
      price: 79,
      image: '/pizzas/vegetarian.png',
      category: 'vegetarian',
      rating: 4.7,
      reviewCount: 145,
      isVegetarian: true,
      badge: '🌿 Kraliyet',
      ingredients: ['Mantar', 'Biber', 'Soğan', 'Mozzarella', 'Fesleğen'],
      preparationTime: '15-18 dk',
      calories: 750
    },
    {
      id: '5',
      name: 'BBQ Royal Chicken',
      description: 'BBQ sosu, tavuk göğsü, soğan, mısır, mozzarella',
      price: 109,
      image: '/pizzas/bbq-chicken.png',
      category: 'royal',
      rating: 4.6,
      reviewCount: 98,
      badge: '🍗 Kraliyet',
      ingredients: ['Tavuk Göğsü', 'BBQ Sosu', 'Soğan', 'Mısır', 'Mozzarella'],
      preparationTime: '18-22 dk',
      calories: 980
    },
    {
      id: '6',
      name: 'Spicy Inferno',
      description: 'Acılı pepperoni, jalapeño, acılı sos, mozzarella',
      price: 119,
      image: '/pizzas/spicy-inferno.png',
      category: 'spicy',
      rating: 4.5,
      reviewCount: 167,
      badge: '🔥 Acılı',
      ingredients: ['Acılı Pepperoni', 'Jalapeño', 'Acılı Sos', 'Mozzarella'],
      preparationTime: '16-20 dk',
      calories: 920
    },
    {
      id: '7',
      name: 'Quattro Stagioni',
      description: 'Dört mevsim: mantar, zeytin, enginar, jambon',
      price: 139,
      image: '/pizzas/quattro-stagioni.png',
      category: 'classic',
      rating: 4.9,
      reviewCount: 203,
      isPremium: true,
      badge: '🍂 Klasik',
      ingredients: ['Mantar', 'Zeytin', 'Enginar', 'Jambon', 'Mozzarella'],
      preparationTime: '20-25 dk',
      calories: 1050
    },
    {
      id: '8',
      name: 'Hawaiian Paradise',
      description: 'Jambon, ananas, mozzarella, özel sos',
      price: 89,
      image: '/pizzas/hawaiian.png',
      category: 'classic',
      rating: 4.3,
      reviewCount: 134,
      badge: '🏝️ Tropik',
      ingredients: ['Jambon', 'Ananas', 'Mozzarella', 'Özel Sos'],
      preparationTime: '15-18 dk',
      calories: 880
    },
    {
      id: '9',
      name: 'Mediterranean Dream',
      description: 'Zeytin, domates, feta peyniri, kekik',
      price: 94,
      image: '/pizzas/mediterranean.png',
      category: 'vegetarian',
      rating: 4.6,
      reviewCount: 178,
      isVegetarian: true,
      badge: '🌊 Akdeniz',
      ingredients: ['Zeytin', 'Domates', 'Feta Peyniri', 'Kekik', 'Mozzarella'],
      preparationTime: '16-20 dk',
      calories: 820
    },
    {
      id: '10',
      name: 'Buffalo Chicken',
      description: 'Buffalo sosu, tavuk, soğan, ranch sosu',
      price: 104,
      image: '/pizzas/buffalo-chicken.png',
      category: 'spicy',
      rating: 4.4,
      reviewCount: 156,
      badge: '🌶️ Buffalo',
      ingredients: ['Tavuk', 'Buffalo Sosu', 'Soğan', 'Ranch Sosu', 'Mozzarella'],
      preparationTime: '18-22 dk',
      calories: 960
    },
    {
      id: '11',
      name: 'Truffle Delight',
      description: 'Trüf mantarı, parmesan, mozzarella, trüf yağı',
      price: 149,
      image: '/pizzas/truffle.png',
      category: 'royal',
      rating: 5.0,
      reviewCount: 89,
      isPremium: true,
      badge: '🍄 Premium',
      ingredients: ['Trüf Mantarı', 'Parmesan', 'Mozzarella', 'Trüf Yağı'],
      preparationTime: '22-25 dk',
      calories: 1150
    },
    {
      id: '12',
      name: 'Spicy Veggie',
      description: 'Acılı sebzeler, mozzarella, acılı sos',
      price: 84,
      image: '/pizzas/spicy-veggie.png',
      category: 'spicy',
      rating: 4.2,
      reviewCount: 112,
      isVegetarian: true,
      badge: '🌶️ Acılı',
      ingredients: ['Acılı Biber', 'Mantar', 'Soğan', 'Acılı Sos', 'Mozzarella'],
      preparationTime: '16-19 dk',
      calories: 780
    }
  ];

  const categories = [
    { 
      id: 'all', 
      name: 'Tümü',
      description: 'Tüm lezzetli pizzalarımız',
      color: 'from-red-500 to-orange-500',
      count: allProducts.length
    },
    { 
      id: 'royal', 
      name: 'Kraliyet Serisi',
      description: 'Premium malzemelerle hazırlanan özel tarifler',
      color: 'from-purple-500 to-pink-500',
      count: allProducts.filter(p => p.category === 'royal').length
    },
    {
      id: 'classic',
      name: 'Klasik Pizzalar',
      description: 'Geleneksel İtalyan lezzetleri',
      color: 'from-red-600 to-red-500',
      count: allProducts.filter(p => p.category === 'classic').length
    },
    {
      id: 'vegetarian',
      name: 'Vejetaryen',
      description: 'Taze sebzelerle hazırlanan sağlıklı seçenekler',
      color: 'from-yellow-500 to-yellow-400',
      count: allProducts.filter(p => p.category === 'vegetarian').length
    },
    {
      id: 'spicy',
      name: 'Acılı Pizzalar',
      description: 'Baharatlı ve keskin lezzetler',
      color: 'from-red-700 to-red-600',
      count: allProducts.filter(p => p.category === 'spicy').length
    },
    {
      id: 'desserts',
      name: 'Tatlılar',
      description: 'Sufle, tiramisu, mozaik pasta',
      color: 'from-yellow-400 to-yellow-500',
      count: 3
    },
    {
      id: 'drinks',
      name: 'İçecekler',
      description: 'Kola, ayran, su, meyve suyu',
      color: 'from-red-500 to-red-600',
      count: 6
    },
    {
      id: 'combos',
      name: 'Menüler',
      description: 'Pizza + İçecek + Patates',
      color: 'from-yellow-500 to-red-600',
      count: 4
    }
  ];

  // Filtreleme ve sıralama
  // Ekstra kategoriler için örnek ürün enjeksiyonu
  const extraItems = [
    { id: 'd1', name: 'Tiramisu', description: 'Klasik İtalyan tatlısı', price: 45, image: '/pizzas/margherita.png', category: 'desserts', rating: 4.8, reviewCount: 52, ingredients: ['Kakao','Mascarpone','Kedi dili'], preparationTime: '—', calories: 380 },
    { id: 'd2', name: 'Sufle', description: 'Sıcak çikolatalı sufle', price: 39, image: '/pizzas/margherita.png', category: 'desserts', rating: 4.7, reviewCount: 61, ingredients: ['Çikolata'], preparationTime: '—', calories: 410 },
    { id: 'b1', name: 'Kola 330ml', description: 'Soğuk servis', price: 25, image: '/pizzas/margherita.png', category: 'drinks', rating: 4.6, reviewCount: 200, ingredients: ['—'], preparationTime: '—', calories: 140 },
    { id: 'b2', name: 'Ayran 300ml', description: 'Serinletici', price: 20, image: '/pizzas/margherita.png', category: 'drinks', rating: 4.6, reviewCount: 120, ingredients: ['—'], preparationTime: '—', calories: 90 },
    { id: 'c1', name: 'Solo Menü', description: 'Orta Pizza + İçecek + Patates', price: 149, image: '/pizzas/margherita.png', category: 'combos', rating: 4.9, reviewCount: 88, ingredients: ['Pizza','Patates','İçecek'], preparationTime: '25 dk', calories: 1300 },
    { id: 'c2', name: 'Aile Menüsü', description: 'Büyük Pizza + 2 İçecek + Patates', price: 219, image: '/pizzas/margherita.png', category: 'combos', rating: 4.9, reviewCount: 73, ingredients: ['Pizza','Patates','İçecek'], preparationTime: '30 dk', calories: 2100 }
  ];

  const filteredProducts = [...allProducts, ...extraItems]
    .filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

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

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const openCheckout = () => {
    if (!localStorage.getItem('token')) {
      alert('Sipariş için giriş yapmalısınız. Lütfen giriş yapın.');
      window.location.href = '/login';
      return;
    }
    setShowCheckout(true);
  };

  const submitOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      alert('Adres ve telefon zorunludur.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const payload = {
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Müşteri',
        customerEmail: user.email || 'unknown@example.com',
        customerPhone: phone,
        deliveryAddress: address,
        items: cartItems.map(ci => ({ name: ci.name, quantity: ci.quantity, price: ci.price })),
        totalPrice,
        customerMessage: notes,
        paymentMethod: 'cash'
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Siparişiniz oluşturuldu!');
        setCartItems([]);
        setShowCheckout(false);
        setAddress(''); setPhone(''); setNotes('');
      } else {
        alert(data.message || 'Sipariş oluşturulamadı');
      }
    } catch (e) {
      alert('Sipariş sırasında hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kraliyet Menü - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'nın özel menüsünü keşfedin. Premium pizzalar ve kraliyet lezzetler." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen relative bg-white">
        <RoyalParallaxScene />
        
        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-40 backdrop-blur-sm border-b bg-white/95 border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-gray-700 hover:text-red-600">
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <Crown className="w-8 h-8 text-red-600" />
                  <h1 className="text-2xl font-bold text-red-600">Kraliyet Menü</h1>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="backdrop-blur-sm border-b bg-white/70 border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pizza ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-yellow-400"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white border border-gray-300 text-gray-900 focus:ring-yellow-400"
                >
                  <option value="name">İsme Göre</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                  <option value="rating">Puana Göre</option>
                </select>
              </div>
                </div>
              </div>

          {/* Categories */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-yellow-400/20">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'ring-4 ring-yellow-400 shadow-2xl'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                    
                    {/* Content */}
                    <div className="relative z-10 text-white text-left">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold">{category.name}</h3>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {category.count} pizza
                        </span>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Active indicator */}
                    {activeCategory === category.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      >
                        <span className="text-purple-900 text-xs font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
        </div>

        {/* Products Grid */}
          <div className="container mx-auto px-4 py-8 bg-[#FFFBF5]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-[#FFD166]/60 dark:border-gray-600 shadow-sm overflow-hidden hover:transform hover:scale-105 transition-all group"
                >
                  <div className="relative">
                    <PremiumImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      priority={index < 4}
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                        {product.badge}
                      </div>
                    )}

                    {/* Premium Crown */}
                    {product.isPremium && (
                      <div className="absolute top-4 right-4">
                        <Crown className="w-6 h-6 text-yellow-400" />
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-12 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-red-500 dark:text-gray-300'
                        }`} 
                      />
                    </button>

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-black/20 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <p className="text-sm mb-2">Hazırlama: {product.preparationTime}</p>
                        <p className="text-sm">Kalori: {product.calories} kcal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#333] dark:text-gray-100">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-[#333] dark:text-gray-300 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-[#333]/80 dark:text-gray-300 mb-4 text-sm">{product.description}</p>
                    
                    {/* Ingredients */}
                    <div className="mb-4">
                      <p className="text-xs text-[#333]/60 dark:text-gray-400 mb-2">Malzemeler:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.ingredients.slice(0, 3).map((ingredient, i) => (
                          <span key={i} className="text-xs bg-[#FFD166]/20 text-[#333] dark:text-gray-100 px-2 py-1 rounded">
                            {ingredient}
                          </span>
                        ))}
                        {product.ingredients.length > 3 && (
                          <span className="text-xs text-[#333]/60 dark:text-gray-400">+{product.ingredients.length - 3} daha</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                          ₺{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[#333]/60 dark:text-gray-400 line-through text-sm">
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#333] dark:text-gray-300 text-lg">Aradığınız kriterlere uygun pizza bulunamadı.</p>
            </div>
          )}
          </div>
        </div>

        {/* Cart Sidebar */}
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
                      <ArrowLeft className="w-6 h-6" />
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
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setCartItems(prev => 
                                      prev.map(cartItem => 
                                        cartItem.id === item.id 
                                          ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                          : cartItem
                                      )
                                    );
                                  } else {
                                    setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id));
                                  }
                                }}
                                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-white font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  setCartItems(prev => 
                                    prev.map(cartItem => 
                                      cartItem.id === item.id 
                                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                        : cartItem
                                    )
                                  );
                                }}
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
                        
                        <button onClick={openCheckout} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 py-3 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-yellow-500 transition-all">
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
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => !submitting && setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl p-6 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute right-4 top-4 text-white/80 hover:text-white" onClick={() => !submitting && setShowCheckout(false)}>
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold mb-4">Teslimat Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Adres</label>
                  <textarea className="w-full px-3 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded-lg" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-2">Telefon</label>
                  <input className="w-full px-3 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Not (opsiyonel)</label>
                  <input className="w-full px-3 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded-lg" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg">Toplam: <span className="font-bold text-yellow-600 dark:text-yellow-400">₺{totalPrice}</span></span>
                  <button disabled={submitting} onClick={submitOrder} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-6 py-3 rounded-full font-bold hover:from-yellow-300 hover:to-yellow-500 disabled:opacity-50">
                    {submitting ? 'Gönderiliyor...' : 'Siparişi Onayla'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// SSR'de hatayı önlemek için bu sayfayı yalnızca istemci tarafında render et
export default dynamic(() => Promise.resolve(RoyalMenu), { ssr: false });


