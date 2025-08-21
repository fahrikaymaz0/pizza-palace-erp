'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, ShoppingCart, ArrowLeft, Filter, Search, Heart } from 'lucide-react';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

export default function RoyalMenu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'Tümü', icon: '👑', count: 12 },
    { id: 'royal', name: 'Kraliyet', icon: '👑', count: 4 },
    { id: 'imperial', name: 'İmparatorluk', icon: '⚔️', count: 3 },
    { id: 'supreme', name: 'Majeste', icon: '👑', count: 2 },
    { id: 'bbq', name: 'BBQ', icon: '🍗', count: 2 },
    { id: 'spicy', name: 'Acılı', icon: '🔥', count: 1 }
  ];

  const royalProducts = [
    {
      id: '1',
      name: 'Royal Margherita',
      description: 'Kraliyet domates sosu, mozzarella di bufala, taze fesleğen, parmesan peyniri',
      price: 89,
      originalPrice: 120,
      image: '/pizzas/margherita.png',
      category: 'royal',
      rating: 4.9,
      reviewCount: 256,
      isPremium: true,
      isVegetarian: true,
      isSpicy: false,
      ingredients: ['Domates sosu', 'Mozzarella di bufala', 'Fesleğen', 'Parmesan'],
      preparationTime: '15-20 dk',
      badge: '👑 Kraliyet',
      calories: 285
    },
    {
      id: '2',
      name: 'Imperial Pepperoni',
      description: 'Özel pepperoni, mozzarella, parmesan peyniri, taze kekik',
      price: 99,
      image: '/pizzas/pepperoni.png',
      category: 'imperial',
      rating: 4.8,
      reviewCount: 189,
      isPremium: true,
      isVegetarian: false,
      isSpicy: true,
      ingredients: ['Pepperoni', 'Mozzarella', 'Parmesan', 'Kekik'],
      preparationTime: '18-22 dk',
      badge: '⚔️ İmparatorluk',
      calories: 320
    },
    {
      id: '3',
      name: 'Supreme Majesty',
      description: 'Kraliyet malzemeleri: sosis, mantar, biber, soğan, zeytin, mozzarella',
      price: 129,
      image: '/pizzas/supreme.png',
      category: 'supreme',
      rating: 5.0,
      reviewCount: 312,
      isPremium: true,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['Sosis', 'Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella'],
      preparationTime: '20-25 dk',
      badge: '👑 Majeste',
      calories: 380
    },
    {
      id: '4',
      name: 'Royal Vegetarian',
      description: 'Taze sebzeler, mozzarella, parmesan, fesleğen, zeytin',
      price: 79,
      image: '/pizzas/vegetarian.png',
      category: 'royal',
      rating: 4.7,
      reviewCount: 145,
      isVegetarian: true,
      isSpicy: false,
      ingredients: ['Sebzeler', 'Mozzarella', 'Parmesan', 'Fesleğen', 'Zeytin'],
      preparationTime: '15-18 dk',
      badge: '🌿 Kraliyet',
      calories: 250
    },
    {
      id: '5',
      name: 'BBQ Royal Chicken',
      description: 'BBQ sosu, tavuk göğsü, soğan, mısır, mozzarella, cheddar',
      price: 109,
      image: '/pizzas/bbq-chicken.png',
      category: 'bbq',
      rating: 4.6,
      reviewCount: 98,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['BBQ sosu', 'Tavuk göğsü', 'Soğan', 'Mısır', 'Mozzarella', 'Cheddar'],
      preparationTime: '18-22 dk',
      badge: '🍗 Kraliyet',
      calories: 340
    },
    {
      id: '6',
      name: 'Mexican Fire',
      description: 'Acılı sos, jalapeño, mısır, tavuk, mozzarella, acı biber',
      price: 119,
      image: '/pizzas/mexican-hot.png',
      category: 'spicy',
      rating: 4.5,
      reviewCount: 87,
      isVegetarian: false,
      isSpicy: true,
      ingredients: ['Acılı sos', 'Jalapeño', 'Mısır', 'Tavuk', 'Mozzarella', 'Acı biber'],
      preparationTime: '20-25 dk',
      badge: '🔥 Ateş',
      calories: 360
    },
    {
      id: '7',
      name: 'Royal Quattro Formaggi',
      description: 'Dört peynir: mozzarella, parmesan, gorgonzola, ricotta',
      price: 95,
      image: '/pizzas/cheesy-lovers.png',
      category: 'royal',
      rating: 4.8,
      reviewCount: 167,
      isPremium: true,
      isVegetarian: true,
      isSpicy: false,
      ingredients: ['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta'],
      preparationTime: '16-20 dk',
      badge: '👑 Kraliyet',
      calories: 310
    },
    {
      id: '8',
      name: 'Imperial Supreme',
      description: 'Sucuk, sosis, mantar, biber, soğan, mozzarella',
      price: 115,
      image: '/pizzas/karisik-pizza.png',
      category: 'imperial',
      rating: 4.7,
      reviewCount: 134,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['Sucuk', 'Sosis', 'Mantar', 'Biber', 'Soğan', 'Mozzarella'],
      preparationTime: '19-23 dk',
      badge: '⚔️ İmparatorluk',
      calories: 350
    },
    {
      id: '9',
      name: 'Royal Napoli',
      description: 'Anchovy, kapari, zeytin, mozzarella, parmesan',
      price: 105,
      image: '/pizzas/napoli.png',
      category: 'royal',
      rating: 4.6,
      reviewCount: 89,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['Anchovy', 'Kapari', 'Zeytin', 'Mozzarella', 'Parmesan'],
      preparationTime: '17-21 dk',
      badge: '👑 Kraliyet',
      calories: 290
    },
    {
      id: '10',
      name: 'BBQ Pulled Pork',
      description: 'BBQ sosu, pulled pork, soğan, mısır, mozzarella',
      price: 125,
      image: '/pizzas/bbq-chicken.png',
      category: 'bbq',
      rating: 4.4,
      reviewCount: 76,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['BBQ sosu', 'Pulled pork', 'Soğan', 'Mısır', 'Mozzarella'],
      preparationTime: '22-26 dk',
      badge: '🍗 Kraliyet',
      calories: 420
    },
    {
      id: '11',
      name: 'Supreme Deluxe',
      description: 'Sucuk, sosis, mantar, biber, soğan, zeytin, mozzarella, parmesan',
      price: 135,
      image: '/pizzas/supreme.png',
      category: 'supreme',
      rating: 4.9,
      reviewCount: 203,
      isPremium: true,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['Sucuk', 'Sosis', 'Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella', 'Parmesan'],
      preparationTime: '23-28 dk',
      badge: '👑 Majeste',
      calories: 410
    },
    {
      id: '12',
      name: 'Royal Funghi',
      description: 'Mantar, mozzarella, parmesan, fesleğen, truffle yağı',
      price: 85,
      image: '/pizzas/funghi.png',
      category: 'royal',
      rating: 4.5,
      reviewCount: 112,
      isVegetarian: true,
      isSpicy: false,
      ingredients: ['Mantar', 'Mozzarella', 'Parmesan', 'Fesleğen', 'Truffle yağı'],
      preparationTime: '14-18 dk',
      badge: '👑 Kraliyet',
      calories: 270
    }
  ];

  const filteredProducts = royalProducts
    .filter(product => 
      (activeCategory === 'all' || product.category === activeCategory) &&
      (searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
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

  return (
    <>
      <Head>
        <title>Kraliyet Menü - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'nın özel menüsünü keşfedin. Premium pizzalar ve kraliyet lezzetler." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen relative">
        <RoyalParallaxScene />
        
        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/90 via-red-900/90 to-purple-900/90 backdrop-blur-sm border-b-2 border-yellow-400/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-yellow-400 hover:text-yellow-300">
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <h1 className="text-2xl font-bold text-white">Kraliyet Menü</h1>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-white hover:text-yellow-400 transition-colors"
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
          <div className="bg-white/10 backdrop-blur-sm border-b border-yellow-400/30">
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
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-gray-400 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 ${
                      activeCategory === category.id
                        ? 'bg-yellow-400 text-purple-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl border border-yellow-400/30 overflow-hidden hover:transform hover:scale-105 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
                      className="absolute top-4 right-12 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-white'
                        }`} 
                      />
                    </button>

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <p className="text-sm mb-2">Hazırlama: {product.preparationTime}</p>
                        <p className="text-sm">Kalori: {product.calories} kcal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white ml-1">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
                    
                    {/* Ingredients */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Malzemeler:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.ingredients.slice(0, 3).map((ingredient, i) => (
                          <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {ingredient}
                          </span>
                        ))}
                        {product.ingredients.length > 3 && (
                          <span className="text-xs text-gray-400">+{product.ingredients.length - 3} daha</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-yellow-400">
                          ₺{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
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
                <p className="text-white text-lg">Aradığınız kriterlere uygun pizza bulunamadı.</p>
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
      </div>
    </>
  );
}


