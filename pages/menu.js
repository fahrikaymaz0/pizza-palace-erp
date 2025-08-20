'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import { ShoppingCart, Heart, Star, Clock, Truck } from 'lucide-react';

const menuProducts = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 89.99,
    originalPrice: 119.99,
    image: "/images/pizzas/margherita.jpg",
    description: "Domates sosu, mozzarella peyniri, fesleğen",
    rating: 4.8,
    reviews: 124,
    prepTime: "20-25 dk",
    isNew: false,
    isHot: true,
    discount: 25,
    ingredients: ["Domates", "Mozzarella", "Fesleğen", "Zeytinyağı"],
    allergens: ["Süt", "Gluten"]
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 99.99,
    originalPrice: 129.99,
    image: "/images/pizzas/pepperoni.jpg",
    description: "Pepperoni, mozzarella peyniri, domates sosu",
    rating: 4.9,
    reviews: 89,
    prepTime: "22-27 dk",
    isNew: false,
    isHot: true,
    discount: 23,
    ingredients: ["Pepperoni", "Mozzarella", "Domates", "Oregano"],
    allergens: ["Süt", "Gluten", "Et"]
  },
  {
    id: 3,
    name: "Supreme Pizza",
    category: "Pizza",
    price: 119.99,
    originalPrice: 149.99,
    image: "/images/pizzas/supreme.jpg",
    description: "Sucuk, sosis, biber, mantar, soğan, zeytin",
    rating: 4.7,
    reviews: 156,
    prepTime: "25-30 dk",
    isNew: false,
    isHot: false,
    discount: 20,
    ingredients: ["Sucuk", "Sosis", "Biber", "Mantar", "Soğan", "Zeytin"],
    allergens: ["Süt", "Gluten", "Et"]
  },
  {
    id: 4,
    name: "BBQ Chicken Pizza",
    category: "Pizza",
    price: 109.99,
    originalPrice: 139.99,
    image: "/images/pizzas/bbq-chicken.jpg",
    description: "BBQ sosu, tavuk, soğan, mısır",
    rating: 4.6,
    reviews: 78,
    prepTime: "23-28 dk",
    isNew: true,
    isHot: false,
    discount: 21,
    ingredients: ["BBQ Sosu", "Tavuk", "Soğan", "Mısır", "Mozzarella"],
    allergens: ["Süt", "Gluten", "Tavuk"]
  },
  {
    id: 5,
    name: "Veggie Supreme",
    category: "Pizza",
    price: 94.99,
    originalPrice: 124.99,
    image: "/images/pizzas/veggie.jpg",
    description: "Mantar, biber, soğan, zeytin, domates",
    rating: 4.5,
    reviews: 92,
    prepTime: "20-25 dk",
    isNew: false,
    isHot: false,
    discount: 24,
    ingredients: ["Mantar", "Biber", "Soğan", "Zeytin", "Domates"],
    allergens: ["Süt", "Gluten"]
  },
  {
    id: 6,
    name: "Buffalo Wings",
    category: "Yan Ürünler",
    price: 69.99,
    originalPrice: 89.99,
    image: "/images/sides/buffalo-wings.jpg",
    description: "8 adet buffalo soslu kanat",
    rating: 4.8,
    reviews: 203,
    prepTime: "15-20 dk",
    isNew: false,
    isHot: true,
    discount: 22,
    ingredients: ["Tavuk Kanadı", "Buffalo Sosu", "Ranch Sosu"],
    allergens: ["Tavuk", "Süt"]
  },
  {
    id: 7,
    name: "Garlic Bread",
    category: "Yan Ürünler",
    price: 24.99,
    originalPrice: 34.99,
    image: "/images/sides/garlic-bread.jpg",
    description: "Sarımsaklı ekmek, 6 dilim",
    rating: 4.4,
    reviews: 167,
    prepTime: "8-12 dk",
    isNew: false,
    isHot: false,
    discount: 29,
    ingredients: ["Ekmek", "Sarımsak", "Tereyağı", "Parmesan"],
    allergens: ["Gluten", "Süt"]
  },
  {
    id: 8,
    name: "Caesar Salad",
    category: "Salata",
    price: 44.99,
    originalPrice: 54.99,
    image: "/images/salads/caesar.jpg",
    description: "Marul, parmesan, kruton, caesar sosu",
    rating: 4.3,
    reviews: 89,
    prepTime: "10-15 dk",
    isNew: false,
    isHot: false,
    discount: 18,
    ingredients: ["Marul", "Parmesan", "Kruton", "Caesar Sosu"],
    allergens: ["Gluten", "Süt", "Yumurta"]
  },
  {
    id: 9,
    name: "Chocolate Lava Cake",
    category: "Tatlı",
    price: 34.99,
    originalPrice: 44.99,
    image: "/images/desserts/lava-cake.jpg",
    description: "Çikolatalı lava kek, dondurma ile",
    rating: 4.9,
    reviews: 134,
    prepTime: "12-15 dk",
    isNew: true,
    isHot: true,
    discount: 22,
    ingredients: ["Çikolata", "Yumurta", "Un", "Şeker", "Dondurma"],
    allergens: ["Gluten", "Yumurta", "Süt"]
  },
  {
    id: 10,
    name: "Tiramisu",
    category: "Tatlı",
    price: 39.99,
    originalPrice: 49.99,
    image: "/images/desserts/tiramisu.jpg",
    description: "İtalyan usulü tiramisu",
    rating: 4.7,
    reviews: 98,
    prepTime: "5-8 dk",
    isNew: false,
    isHot: false,
    discount: 20,
    ingredients: ["Mascarpone", "Kahve", "Kakao", "Bisküvi"],
    allergens: ["Gluten", "Yumurta", "Süt"]
  }
];

const categories = [
  { id: 'all', name: 'Tümü', icon: '🍕' },
  { id: 'Pizza', name: 'Pizza', icon: '🍕' },
  { id: 'Yan Ürünler', name: 'Yan Ürünler', icon: '🍗' },
  { id: 'Salata', name: 'Salata', icon: '🥗' },
  { id: 'Tatlı', name: 'Tatlı', icon: '🍰' }
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = menuProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return b.reviews - a.reviews; // popular
    }
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <>
      <Head>
        <title>Menü - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'nın lezzetli menüsü. Taze malzemeler, özel tarifler ve hızlı teslimat." />
        <meta name="keywords" content="pizza, menü, sipariş, teslimat, pizza krallığı" />
        <meta property="og:title" content="Menü - Pizza Krallığı" />
        <meta property="og:description" content="Pizza Krallığı'nın lezzetli menüsü. Taze malzemeler, özel tarifler ve hızlı teslimat." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Menü - Pizza Krallığı" />
        <meta name="twitter:description" content="Pizza Krallığı'nın lezzetli menüsü. Taze malzemeler, özel tarifler ve hızlı teslimat." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                🍕 Lezzetli Menümüz
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Taze malzemeler, özel tarifler, unutulmaz lezzetler
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Menüde ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'popular'
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Popüler
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'price-low'
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Fiyat (Düşük)
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'price-high'
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Fiyat (Yüksek)
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'rating'
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Puan
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'newest'
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Yeni
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 pb-16">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Ürün bulunamadı
              </h3>
              <p className="text-gray-500">
                Arama kriterlerinize uygun ürün bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          setCart={setCart}
        />

        <Footer />
      </div>
    </>
  );
}


