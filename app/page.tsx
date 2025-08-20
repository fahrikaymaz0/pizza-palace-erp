import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-8">
            🍕 Pizza Palace v3.0.0
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
            Fresh system - No cache issues - Working APIs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Kullanıcı Bölümü */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white bg-opacity-20 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-3xl font-bold text-white mb-4">👥 Müşteriler</h2>
              <p className="text-white mb-6">Pizza siparişi verin, kayıt olun</p>

              <div className="space-y-4">
                <Link href="/menu" className="block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    🍕 Pizza Menü
                  </motion.div>
                </Link>

                <Link href="/register" className="block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    📝 Kayıt Ol
                  </motion.div>
                </Link>

                <Link href="/login" className="block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    🔐 Giriş Yap
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Admin Bölümü */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white bg-opacity-20 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-3xl font-bold text-white mb-4">👨‍💼 Yöneticiler</h2>
              <p className="text-white mb-6">Siparişleri yönetin, raporları görün</p>

              <div className="space-y-4">
                <Link href="/admin/login" className="block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    🔐 Admin Girişi
                  </motion.div>
                </Link>

                <Link href="/admin/dashboard" className="block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    📊 Dashboard
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white mb-4">System Info:</h3>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg inline-block backdrop-blur-sm">
              <p className="text-white text-sm">
                <strong>Version:</strong> 3.0.0 (Fresh)
              </p>
              <p className="text-white text-sm">
                <strong>Frontend:</strong> Next.js 14 + TypeScript
              </p>
              <p className="text-white text-sm">
                <strong>Backend:</strong> In-memory API routes
              </p>
              <p className="text-white text-sm">
                <strong>Status:</strong> ✅ No 405/401 errors
              </p>
            </div>
          </motion.div>

          {/* Test Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 space-y-2"
          >
            <a 
              href="/api/test" 
              target="_blank"
              className="block text-white hover:text-yellow-200 underline"
            >
              🧪 Test API
            </a>
            <a 
              href="/api/health" 
              target="_blank"
              className="block text-white hover:text-yellow-200 underline"
            >
              ❤️ Health Check
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 