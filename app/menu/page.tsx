'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Pizza {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export default function MenuPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPizzas()
  }, [])

  const fetchPizzas = async () => {
    try {
      const response = await fetch('/api/pizza/menu')
      const data = await response.json()
      
      if (data.success) {
        setPizzas(data.data)
      }
    } catch (error) {
      console.error('Pizza menüsü yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center">
        <div className="text-white text-2xl">🍕 Menü yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">🍕 Pizza Menüsü</h1>
          <p className="text-xl text-white opacity-90">En lezzetli pizzalarımızı keşfedin!</p>
        </motion.div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pizzas.map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-4xl">🍕</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pizza.name}</h3>
                <p className="text-gray-600 mb-4">{pizza.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-red-600">₺{pizza.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Sepete Ekle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/" className="text-white hover:text-gray-200 text-lg">
            ← Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 