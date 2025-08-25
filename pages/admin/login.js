import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Crown, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Don't auto-redirect, let user login manually
    // This prevents issues with invalid tokens
  }, [router]);

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
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        // Save admin token and user data
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify({ id: data.data.id, email: data.data.email }));
        
        alert('Admin girişi başarılı!');
        router.push('/admin/dashboard');
      } else {
        setErrors({ general: 'Admin yetkisi bulunamadı.' });
        alert('Admin yetkisi bulunamadı.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ general: 'Giriş sırasında bir hata oluştu.' });
      alert('Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Girişi - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı Admin Paneli" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative">
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Admin Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <Shield className="w-16 h-16 text-purple-600 mx-auto" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Girişi
              </h1>
              <p className="text-gray-600">
                Yönetici paneline erişim
              </p>
            </div>

            {/* Admin Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-xl"
            >
              {/* Demo Credentials */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Giriş Bilgileri:</h3>
                <p className="text-xs text-blue-700">
                  <strong>E-posta:</strong> admin@pizzakralligi.com<br />
                  <strong>Şifre:</strong> Admin123!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-[#333] text-sm font-medium mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.email ? 'border-red-400' : 'border-purple-300'
                      }`}
                      placeholder="admin@pizzakralligi.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[#333] text-sm font-medium mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.password ? 'border-red-400' : 'border-purple-300'
                      }`}
                      placeholder="Şifrenizi girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8D6E63] hover:text-[#6D4C41]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Giriş Yapılıyor...' : 'Admin Girişi'}
                </motion.button>

                {errors.general && (
                  <p className="text-red-600 text-sm text-center">{errors.general}</p>
                )}
              </form>

              {/* Back to User Login */}
              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  ← Kullanıcı Girişine Dön
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
