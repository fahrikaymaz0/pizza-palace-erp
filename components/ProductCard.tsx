'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Plus, Minus, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    reviewCount: number;
    isPopular?: boolean;
    isNew?: boolean;
    isSpicy?: boolean;
    isVegetarian?: boolean;
    ingredients?: string[];
    allergens?: string[];
  };
  onAddToCart: (productId: string, quantity: number) => void;
  onAddToFavorites: (productId: string) => void;
  onQuickView: (productId: string) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToFavorites,
  onQuickView,
  className
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    onAddToCart(product.id, quantity);
    
    // Reset after animation
    setTimeout(() => {
      setIsAddingToCart(false);
      setQuantity(1);
    }, 1000);
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    onAddToFavorites(product.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        "group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      layout
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {product.isPopular && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
          >
            Popüler
          </motion.div>
        )}
        {product.isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
          >
            Yeni
          </motion.div>
        )}
        {product.isSpicy && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
          >
            Acılı
          </motion.div>
        )}
        {product.isVegetarian && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
          >
            Vejetaryen
          </motion.div>
        )}
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          %{discountPercentage} İndirim
        </div>
      )}

      {/* Favorite Button */}
      <motion.button
        onClick={handleAddToFavorites}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-colors",
            isFavorite ? "text-red-500 fill-current" : "text-gray-600"
          )} 
        />
      </motion.button>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Quick View Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.button
                onClick={() => onQuickView(product.id)}
                className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                <span>Hızlı Bakış</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₺{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₺{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={cn(
            "w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300",
            isAddingToCart
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white hover:bg-red-700"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {isAddingToCart ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key="cart"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <span>
            {isAddingToCart ? 'Sepete Eklendi!' : 'Sepete Ekle'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}


