import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

export default function RoyalLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Giriş başarılı! Hoş geldiniz.');
        window.location.href = '/';
      } else {
        setErrors({ general: data.message });
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Giriş sırasında bir hata oluştu.' });
      alert('Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kraliyet Girişi - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'na giriş yapın ve kraliyet lezzetlerini keşfedin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen relative">
        <RoyalParallaxScene />
        
        <div className="relative z-10 min-h-[80vh] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Royal Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Kraliyet Girişi
              </h1>
              <p className="text-gray-300">
                Pizza Krallığı'na hoş geldiniz
              </p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl border border-red-700/40 p-8 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent ${
                        errors.email ? 'border-red-400' : 'border-gray-400'
                      }`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent ${
                        errors.password ? 'border-red-400' : 'border-gray-400'
                      }`}
                      placeholder="Şifrenizi girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-400 bg-white/20 border-gray-400 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Beni hatırla</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300">
                    Şifremi unuttum
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-900 mr-2"></div>
                      Giriş Yapılıyor...
                    </div>
                  ) : (
                    'Kraliyet Girişi Yap'
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-400"></div>
                <span className="px-4 text-gray-300 text-sm">veya</span>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  Misafir Olarak Devam Et
                </button>
              </div>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Henüz üye değil misiniz?{' '}
                  <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                    Kraliyet Üyeliği Oluşturun
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 