'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PizzaIngredientsAnimation from '@/components/PizzaIngredientsAnimation';

export default function PizzaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde loading animasyonunu göster
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pizza admin giriş kontrolü - pizzapalaceofficial00@gmail.com / passwordadmin123
    if (
      email === 'pizzapalaceofficial00@gmail.com' &&
      password === 'passwordadmin123'
    ) {
      console.log(
        'Pizza admin girişi tespit edildi - API üzerinden doğrulanıyor'
      );

      try {
        // Pizza admin girişi için Vercel API çağrısı
        const response = await fetch('/api/auth/vercel-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log(
            "Pizza admin girişi başarılı - Pizza admin panel'e yönlendiriliyor"
          );
          window.location.href = '/pizza-admin'; // Redirect to pizza admin panel
        } else {
          setError(data.error || 'Pizza admin girişi başarısız');
        }
      } catch (error) {
        console.error('Pizza admin login error:', error);
        setError('Bağlantı hatası');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Admin giriş kontrolü - admin@123 / admin123
    if (email === 'admin@123' && password === 'admin123') {
      console.log('Admin girişi tespit edildi - API üzerinden doğrulanıyor');

      try {
        // Admin girişi için Vercel API çağrısı
        const response = await fetch('/api/auth/vercel-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log(
            "Admin girişi başarılı - Admin dashboard'a yönlendiriliyor"
          );
          window.location.href = '/admin'; // Redirect to admin dashboard
        } else {
          setError(data.error || 'Admin girişi başarısız');
        }
      } catch (error) {
        console.error('Admin login error:', error);
        setError('Bağlantı hatası');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal kullanıcı girişi
    try {
      // Vercel endpoint'ini kullan
      const response = await fetch('/api/auth/vercel-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(
          'Normal kullanıcı girişi başarılı - Ana sayfaya yönlendiriliyor'
        );
        window.location.href = '/pizza';
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/pizza-slices.gif"
              alt="Loading..."
              width={128}
              height={128}
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
        {/* Düşen malzemeler animasyonu */}
        <PizzaIngredientsAnimation />
        <div className="text-center relative z-10">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/pizza-slices.gif"
              alt="Loading..."
              width={128}
              height={128}
              priority
            />
          </div>
        </div>
      </div>
    );
  }

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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
              {error}
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
                Giriş yapılıyor...
              </div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-white/70 text-sm">
            Hesabınız yok mu?{' '}
            <Link
              href="/pizza/register"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Kayıt Ol
            </Link>
          </p>
          <p className="text-white/70 text-sm">
            <Link
              href="/pizza/forgot-password"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Şifremi Unuttum
            </Link>
          </p>
          <div className="pt-4 mt-2 border-t border-white/20 space-y-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              🔑 ERP Admin Girişi
            </Link>
            <div className="text-center">
              <Link
                href="/pizza-admin/login"
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                🍕 Pizza Admin Girişi
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* Admin Girişi bilgilendirmesini kaldırdım */}
      </div>

      <style jsx>{`
        .pizza-logo {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pizza-icon {
          width: 80px;
          height: 80px;
          position: relative;
          animation: pulse 2s ease-in-out infinite;
        }

        .pizza-base {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .pizza-toppings {
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
        }

        .topping {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          position: absolute;
          animation: bounce 1s ease-in-out infinite;
        }

        .topping-1 {
          background: #dc2626;
          top: 20%;
          left: 30%;
          animation-delay: 0s;
        }

        .topping-2 {
          background: #fbbf24;
          top: 40%;
          left: 60%;
          animation-delay: 0.2s;
        }

        .topping-3 {
          background: #fde047;
          top: 60%;
          left: 20%;
          animation-delay: 0.4s;
        }

        .topping-4 {
          background: #dc2626;
          top: 50%;
          left: 50%;
          animation-delay: 0.6s;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .spice {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fbbf24;
          border-radius: 50%;
          animation: fall 4s linear infinite;
        }

        .spice-1 {
          left: 5%;
          animation-delay: 0s;
        }
        .spice-2 {
          left: 15%;
          animation-delay: 1s;
        }
        .spice-3 {
          left: 25%;
          animation-delay: 2s;
        }
        .spice-4 {
          left: 35%;
          animation-delay: 0.5s;
        }
        .spice-5 {
          left: 45%;
          animation-delay: 1.5s;
        }

        @keyframes fall {
          0% {
            top: -10px;
            opacity: 1;
          }
          100% {
            top: 100vh;
            opacity: 0;
          }
        }

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
