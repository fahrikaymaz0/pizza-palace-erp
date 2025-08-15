'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PizzaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 CACHE-BREAKING LOGIN - Yeni endpoint kullanılıyor');
      
      const response = await fetch('/api/auth/unified-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Login response:', data);

      if (data.success) {
        console.log('✅ Login successful, redirecting...');
        
        // Role-based redirection
        const userRole = data.data?.user?.role;
        
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'pizza_admin') {
          router.push('/pizza-admin');
        } else {
          router.push('/pizza');
        }
      } else {
        setError(data.error || 'Giriş hatası');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍕 Pizza Palace</h1>
          <p className="text-gray-600">Giriş Yap</p>
          <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm">
            <p className="text-blue-800 font-semibold">🔄 Cache-Breaking Version</p>
            <p className="text-blue-600">Yeni auth sistemi aktif</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Hesabınız yok mu?{' '}
            <a href="/pizza/register" className="text-orange-500 hover:text-orange-600 font-medium">
              Kayıt ol
            </a>
          </p>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Test Hesapları:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p><strong>Müşteri:</strong> test@example.com / 123456</p>
            <p><strong>Admin:</strong> admin@123 / 123456</p>
            <p><strong>Pizza Admin:</strong> pizzapalaceofficial00@gmail.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
