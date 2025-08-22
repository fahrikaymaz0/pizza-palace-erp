import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

export default function RoyalRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gereklidir';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adres gereklidir';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredEmail(formData.email);
        setShowVerificationModal(true);
        alert('Kayıt başarılı! E-posta adresinize doğrulama kodu gönderildi. Lütfen kodu girin.');
      } else {
        setErrors({ general: data.message });
        alert(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Kayıt sırasında bir hata oluştu.' });
      alert('Kayıt sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      alert('Lütfen doğrulama kodunu girin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registeredEmail,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('E-posta başarıyla doğrulandı! Giriş yapabilirsiniz.');
        window.location.href = '/login?verified=true';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Doğrulama sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kraliyet Üyeliği - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'na katılın ve kraliyet lezzetlerini keşfedin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 relative">
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg"
          >
            {/* Royal Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <Crown className="w-16 h-16 text-red-600 mx-auto" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kraliyet Üyeliği
              </h1>
              <p className="text-gray-600">
                Pizza Krallığı&apos;na katılın ve özel ayrıcalıklardan yararlanın
              </p>
            </div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#333] text-sm font-medium mb-2">
                      Ad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                          errors.firstName ? 'border-red-400' : 'border-[#FFD166]/60'
                        }`}
                        placeholder="Adınız"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#333] text-sm font-medium mb-2">
                      Soyad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                          errors.lastName ? 'border-red-400' : 'border-[#FFD166]/60'
                        }`}
                        placeholder="Soyadınız"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                        errors.email ? 'border-red-400' : 'border-[#FFD166]/60'
                      }`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[#333] text-sm font-medium mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                        errors.phone ? 'border-red-400' : 'border-[#FFD166]/60'
                      }`}
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-[#333] text-sm font-medium mb-2">
                    Adres
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                        errors.address ? 'border-red-400' : 'border-[#FFD166]/60'
                      }`}
                      placeholder="Teslimat adresiniz"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-4">
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
                        className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                          errors.password ? 'border-red-400' : 'border-[#FFD166]/60'
                        }`}
                        placeholder="En az 6 karakter"
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

                  <div>
                    <label className="block text-[#333] text-sm font-medium mb-2">
                      Şifre Tekrarı
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent ${
                          errors.confirmPassword ? 'border-red-400' : 'border-[#FFD166]/60'
                        }`}
                        placeholder="Şifrenizi tekrar girin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8D6E63] hover:text-[#6D4C41]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Kayıt Oluşturuluyor...' : 'Kraliyet Üyeliği Oluştur'}
                </motion.button>

                {errors.general && (
                  <p className="text-red-600 text-sm text-center">{errors.general}</p>
                )}
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-[#8D6E63]">
                  Zaten üye misiniz?{' '}
                  <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                    Giriş Yapın
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-center mb-4">E-posta Doğrulama</h2>
            <p className="text-gray-600 text-center mb-6">
              {registeredEmail} adresine gönderilen 6 haneli doğrulama kodunu girin.
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-2xl font-bold tracking-widest py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerification}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 