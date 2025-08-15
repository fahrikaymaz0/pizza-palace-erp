'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PizzaRegister() {
  const [name, setName] = useState('');
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
      console.log('🔄 CACHE-BREAKING REGISTER - Yeni endpoint kullanılıyor');
      
      const response = await fetch('/api/auth/unified-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log('📡 Register response:', data);

      if (data.success) {
        console.log('✅ Registration successful, redirecting...');
        router.push('/pizza');
      } else {
        setError(data.error || 'Kayıt hatası');
      }
    } catch (error) {
      console.error('❌ Register error:', error);
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
          <p className="text-gray-600">Hesap Oluştur</p>
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
              İsim
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Adınız Soyadınız"
              required
            />
          </div>

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
              placeholder="En az 6 karakter"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Kayıt oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Zaten hesabınız var mı?{' '}
            <a href="/pizza/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Giriş yap
            </a>
          </p>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">💡 İpucu:</p>
          <p className="text-xs text-gray-500">
            Kayıt olduktan sonra pizza siparişi verebilir, favori pizzalarınızı ekleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
