'use client';

import { useState } from 'react';
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

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Role'e göre yönlendirme
        const role = data.data.user.role;
        if (role === 'pizza_admin') {
          window.location.href = '/pizza-admin';
        } else if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/pizza';
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
      {/* Floating pizza emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🍕</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍕</div>
        <div className="absolute bottom-20 left-20 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🍕</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>🍕</div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pizza Krallığı</h1>
          <p className="text-gray-600">Hesabınıza giriş yapın</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Adresi
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Giriş Yapılıyor...
              </div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/pizza/register" className="text-orange-600 hover:text-orange-700 font-semibold">
              Kayıt Olun
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Test Kullanıcıları:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <strong>Normal Kullanıcı:</strong> test@example.com / 123456
              </div>
              <div>
                <strong>Pizza Admin:</strong> pizzapalaceofficial00@gmail.com / 123456
              </div>
              <div>
                <strong>Admin:</strong> admin@123 / 123456
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
