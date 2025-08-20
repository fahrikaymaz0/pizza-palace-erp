'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pizza, Coffee, IceCream, Utensils, Star, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string) => void;
  activeCategory?: string;
  className?: string;
}

const categories: Category[] = [
  {
    id: 'all',
    name: 'Tümü',
    icon: Utensils,
    color: 'bg-gray-500',
    count: 24
  },
  {
    id: 'pizzas',
    name: 'Pizzalar',
    icon: Pizza,
    color: 'bg-red-500',
    count: 12
  },
  {
    id: 'drinks',
    name: 'İçecekler',
    icon: Coffee,
    color: 'bg-blue-500',
    count: 8
  },
  {
    id: 'desserts',
    name: 'Tatlılar',
    icon: IceCream,
    color: 'bg-pink-500',
    count: 4
  },
  {
    id: 'popular',
    name: 'Popüler',
    icon: Star,
    color: 'bg-yellow-500',
    count: 6
  },
  {
    id: 'spicy',
    name: 'Acılı',
    icon: Flame,
    color: 'bg-orange-500',
    count: 3
  }
];

export default function CategoryFilter({ 
  onCategoryChange, 
  activeCategory = 'all',
  className 
}: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Categories */}
      <div className="hidden md:flex items-center justify-center space-x-2 mb-8">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={cn(
                "relative flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
                isActive 
                  ? "bg-red-600 text-white shadow-lg" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-red-600 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex items-center space-x-2">
                <category.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-gray-600"
                )} />
                <span>{category.name}</span>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {category.count}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Categories */}
      <div className="md:hidden mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap",
                  isActive 
                    ? "bg-red-600 text-white" 
                    : "bg-white text-gray-700 border border-gray-200"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-white" : "text-gray-600"
                )} />
                <span>{category.name}</span>
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Category Info */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {categories.find(c => c.id === activeCategory)?.name}
        </h3>
        <p className="text-gray-600">
          {activeCategory === 'all' 
            ? 'Tüm lezzetli ürünlerimizi keşfedin'
            : activeCategory === 'pizzas'
            ? 'En taze malzemelerle hazırlanan pizzalar'
            : activeCategory === 'drinks'
            ? 'Serinletici içecekler'
            : activeCategory === 'desserts'
            ? 'Tatlı krizleriniz için özel tarifler'
            : activeCategory === 'popular'
            ? 'Müşterilerimizin en çok tercih ettiği ürünler'
            : 'Acı sevenler için özel tarifler'
          }
        </p>
      </motion.div>
    </div>
  );
}
