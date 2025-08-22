'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Heart, Clock, Flame } from 'lucide-react';
import Image from 'next/image';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPremium?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  badge?: string;
  preparationTime?: number;
}

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
  isInView?: boolean;
  delay?: number;
}

export default function ModernProductCard({ 
  product, 
  onAddToCart, 
  className,
  isInView = true,
  delay = 0
}: ModernProductCardProps) {
  const [isLoved, setIsLoved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100',
        'hover:scale-[1.02] hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-100">
        {/* Discount Badge */}
        {discount > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="absolute top-3 left-3 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
          >
            -%{discount}
          </motion.div>
        )}

        {/* Premium Badge */}
        {product.isPremium && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
            className="absolute top-3 right-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            👑 PREMIUM
          </motion.div>
        )}

        {/* Love Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLoved(!isLoved);
          }}
          className="absolute bottom-3 right-3 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Heart 
            className={cn(
              'w-5 h-5 transition-all duration-300',
              isLoved ? 'text-red-500 fill-current scale-110' : 'text-gray-400 hover:text-red-400'
            )}
          />
        </motion.button>

        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-all duration-700 group-hover:scale-110',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/pizzas/margherita.png'; // Fallback image
          }}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-3">
          {product.isVegetarian && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              🌱 Vejeteryan
            </span>
          )}
          {product.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              <Flame className="w-3 h-3" />
              Acılı
            </span>
          )}
          {product.preparationTime && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              {product.preparationTime}dk
            </span>
          )}
        </div>

        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                ₺{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₺{product.originalPrice}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-xs text-green-600 font-medium">
                ₺{(product.originalPrice! - product.price).toFixed(0)} tasarruf
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            className="group/btn relative px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
              Sepete Ekle
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 border-2 border-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
