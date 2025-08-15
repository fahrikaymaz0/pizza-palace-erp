'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PizzaAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('pizzapalaceofficial00@gmail.com');
  const [password, setPassword] = useState('passwordadmin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Giriş başarısız');
      }
      const role = data?.data?.user?.role;
      if (role !== 'pizza_admin') {
        throw new Error('Bu sayfa yalnızca Pizza Admin için');
      }
      router.replace('/pizza-admin');
    } catch (err: any) {
      setError(err?.message || 'Giriş sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl">🍕</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Pizza Palace Admin
          </h1>
          <p className="text-sm text-gray-600 mt-1">Sipariş Yönetimi Girişi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
