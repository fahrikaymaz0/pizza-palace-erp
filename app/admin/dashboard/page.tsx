'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">👨‍💼 Admin Dashboard</h1>
          <p className="text-xl text-gray-300">Pizza Palace Yönetim Paneli</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-red-600 mb-2">🍕</div>
            <h3 className="text-lg font-semibold text-gray-800">Toplam Sipariş</h3>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-800">Günlük Gelir</h3>
            <p className="text-3xl font-bold text-gray-900">₺1,250</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-800">Aktif Müşteri</h3>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-yellow-600 mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-gray-800">Ortalama Puan</h3>
            <p className="text-3xl font-bold text-gray-900">4.8</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/menu" className="block">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🍕</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pizza Menüsü</h3>
                <p className="text-gray-600">Menüyü görüntüle ve düzenle</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/orders" className="block">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Siparişler</h3>
                <p className="text-gray-600">Siparişleri yönet</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/users" className="block">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Müşteriler</h3>
                <p className="text-gray-600">Müşteri listesini görüntüle</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/" className="text-white hover:text-gray-300 text-lg">
            ← Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 