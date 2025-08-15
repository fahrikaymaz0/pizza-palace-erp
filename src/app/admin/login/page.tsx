'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 ADMIN LOGIN - Doğru endpoint kullanılıyor');
      
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Admin login response:', data);

      if (response.ok && data.success) {
        console.log('✅ Admin login successful, redirecting...');
        router.push('/admin');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-20">
            <span className="text-2xl">👨‍💼</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Yönetim paneline erişim
          </p>
          <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm">
            <p className="text-blue-800 font-semibold">🔄 Cache-Breaking Version</p>
            <p className="text-blue-600">Doğru endpoint kullanılıyor</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="admin@123"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </form>

        <div className="text-center bg-white bg-opacity-10 p-4 rounded-lg">
          <p className="text-sm text-white font-medium mb-2">Test Admin Hesapları:</p>
          <div className="space-y-1 text-xs text-blue-100">
            <p><strong>Admin:</strong> admin@123 / 123456</p>
            <p><strong>Pizza Admin:</strong> pizzapalaceofficial00@gmail.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
