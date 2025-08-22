'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  totalPrice: number;
  onOrderStart?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  totalPrice,
  onOrderStart,
}: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Sepetim</h3>
              {cartItems.length > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col h-full">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz boş</h4>
                <p className="text-gray-600 text-center mb-6">
                  Lezzetli pizzalarımızı keşfedin ve sipariş vermeye başlayın
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  Menüyü Keşfet
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/pizzas/margherita.png';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-red-600 font-bold">₺{item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Toplam:</span>
                    <span className="text-2xl font-bold text-red-600">₺{totalPrice}</span>
                  </div>

                  {/* Delivery Info */}
                  <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Ücretsiz teslimat (50₺ üzeri)
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <span className="text-green-600">✓</span>
                      Tahmini teslimat: 25-35 dakika
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOrderStart?.();
                      }}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-red-700 transition-colors"
                    >
                      Siparişi Tamamla
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
                    >
                      Alışverişe Devam Et
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}