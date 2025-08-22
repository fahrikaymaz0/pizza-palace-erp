import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

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
        // E-posta doğrulama e-postası gönder
        const verificationResponse = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const verificationData = await verificationResponse.json();
        
        if (verificationData.success) {
          alert('Kayıt başarılı! E-posta adresinize doğrulama linki gönderildi. E-posta kutunuzu kontrol edin.');
        } else {
          alert('Kayıt başarılı ancak doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.');
        }
        
        window.location.href = '/login?registered=true';
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

  return (
    <>
      <Head>
        <title>Kraliyet Üyeliği - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'na katılın ve kraliyet lezzetlerini keşfedin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 relative">
        <RoyalParallaxScene />
        
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
                Pizza Krallığı'na katılın ve özel ayrıcalıklardan yararlanın
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

                {/* Email */}
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

                {/* Phone */}
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
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
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
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#333] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent resize-none ${
                        errors.address ? 'border-red-400' : 'border-[#FFD166]/60'
                      }`}
                      placeholder="Teslimat adresiniz"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Password */}
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8D6E63] hover:text-[#333]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8D6E63] hover:text-[#333]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#C21D2B] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#A31622] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Kayıt Oluşturuluyor...
                    </div>
                  ) : (
                    'Kraliyet Üyeliği Oluştur'
                  )}
                </motion.button>
              </form>

              {/* After submit info */}
              <div className="mt-4 text-center text-sm text-[#333]/80">
                Kayıt sonrası doğrulama sayfasına gitmek için <a href="/verify" className="text-[#C21D2B] underline">buraya</a> tıklayın.
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-[#333]/80">
                  Zaten üye misiniz?{' '}
                  <Link href="/login" className="text-[#C21D2B] font-semibold hover:opacity-80">
                    Giriş Yapın
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link href="/" className="text-[#C21D2B] font-semibold hover:opacity-80">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 