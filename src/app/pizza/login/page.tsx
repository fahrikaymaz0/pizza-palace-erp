'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PizzaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pizza admin giriş kontrolü
    if (email === 'pizzapalaceofficial00@gmail.com' && password === '123456') {
      console.log(
        'Pizza admin girişi tespit edildi - API üzerinden doğrulanıyor'
      );

      try {
        const response = await fetch('/api/v2/auth/login', {
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
            "Pizza admin girişi başarılı - Pizza admin dashboard'a yönlendiriliyor"
          );
          window.location.href = '/pizza-admin';
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

    // Normal kullanıcı girişi
    try {
      const response = await fetch('/api/v2/auth/login', {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 animate-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Pizza Slices */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="text-4xl opacity-20">🍕</div>
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src="/Pizza Krallığı Logosu.png"
                alt="Pizza Krallığı"
                width={96}
                height={96}
                className="rounded-lg"
                priority
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz
            </h2>
            <p className="text-gray-600">Hesabınıza giriş yapın</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Adresi
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/pizza/register"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Hesabınız yok mu? Kayıt olun
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Test Hesap Bilgileri:
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>👤 Normal Kullanıcı: test@example.com / 123456</div>
                <div>
                  👨‍🍳 Pizza Admin: pizzapalaceofficial00@gmail.com / 123456
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
