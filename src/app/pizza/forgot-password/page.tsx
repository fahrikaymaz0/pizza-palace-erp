'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PizzaIngredientsAnimation from '@/components/PizzaIngredientsAnimation';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Şifre sıfırlama kodu email adresinize gönderildi!');
        setStep('reset');
      } else {
        setError(data.error || 'Email gönderilemedi');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          'Şifreniz başarıyla güncellendi! Ana sayfaya yönlendiriliyorsunuz...'
        );
        setTimeout(() => {
          router.push('/pizza');
        }, 2000);
      } else {
        setError(data.error || 'Şifre sıfırlama başarısız');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
      {/* Düşen malzemeler animasyonu */}
      <PizzaIngredientsAnimation />

      <div className="relative z-10 w-full max-w-md mx-auto p-8 bg-orange-900/60 rounded-2xl shadow-lg border border-orange-200">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-48 h-36 mx-auto">
            <Image
              src="/Pizza Krallığı Logosu.png"
              alt="Pizza Krallığı"
              width={192}
              height={144}
              priority
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* Form Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 'email' ? '🔐 Şifremi Unuttum' : '🔑 Yeni Şifre Belirle'}
          </h2>
          <p className="text-white/70 text-sm">
            {step === 'email'
              ? 'Email adresinizi girin, size şifre sıfırlama kodu gönderelim'
              : "Email'inize gelen kodu girin ve yeni şifrenizi belirleyin"}
          </p>
        </div>

        {step === 'email' ? (
          /* Email Step */
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="email@example.com"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-200 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="pizza-loading-spinner mr-2"></div>
                  Kod gönderiliyor...
                </div>
              ) : (
                'Şifre Sıfırlama Kodu Gönder'
              )}
            </button>
          </form>
        ) : (
          /* Reset Step */
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-center text-2xl tracking-widest"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-200 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="pizza-loading-spinner mr-2"></div>
                  Şifre güncelleniyor...
                </div>
              ) : (
                'Şifreyi Güncelle'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Email adresini değiştir
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Şifrenizi hatırladınız mı?{' '}
            <Link
              href="/pizza/login"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .pizza-loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
