'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PizzaAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('pizzapalaceofficial00@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('🔄 PIZZA ADMIN LOGIN - Doğru endpoint kullanılıyor');
      
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('📡 Pizza admin login response:', data);
      
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Giriş başarısız');
      }
      
      const role = data?.data?.user?.role;
      if (role !== 'pizza_admin') {
        throw new Error('Bu sayfa yalnızca Pizza Admin için');
      }
      
      console.log('✅ Pizza admin login successful, redirecting...');
      router.replace('/pizza-admin');
    } catch (err: any) {
      console.error('❌ Pizza admin login error:', err);
      setError(err?.message || 'Giriş sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-20">
            <span className="text-2xl">🍕</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Pizza Admin Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-orange-100">
            Pizza Palace yönetim paneline erişim
          </p>
          <div className="bg-orange-50 p-3 rounded-lg mt-4 text-sm">
            <p className="text-orange-800 font-semibold">🔄 Cache-Breaking Version</p>
            <p className="text-orange-600">Doğru endpoint kullanılıyor</p>
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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="pizzapalaceofficial00@gmail.com"
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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-white font-medium mb-2">Test Pizza Admin:</p>
          <p className="text-xs text-orange-100">
            pizzapalaceofficial00@gmail.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}
