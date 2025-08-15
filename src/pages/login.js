import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API URL - Production'da localhost'a yönlendir
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api' 
    : '/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 User login attempt...');
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Giriş hatası');
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);

      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);

      // Pizza menüsüne yönlendir
      router.push('/pizza');

    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Giriş sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Giriş Yap - Pizza Palace</title>
        <meta name="description" content="Pizza Palace giriş sayfası" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-20">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Giriş Yap
            </h2>
            <p className="mt-2 text-center text-sm text-blue-100">
              Pizza Palace hesabınıza giriş yapın
            </p>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="ornek@email.com"
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
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Şifreniz"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="text-center">
              <Link href="/register" className="text-white hover:text-blue-100 text-sm">
                Hesabınız yok mu? Kayıt olun
              </Link>
            </div>
          </form>

          <div className="text-center">
            <Link href="/" className="text-white hover:text-blue-100 text-sm">
              ← Ana Sayfaya Dön
            </Link>
          </div>

          <div className="text-center bg-white bg-opacity-10 p-4 rounded-lg">
            <p className="text-sm text-white font-medium mb-2">Test Hesabı:</p>
            <p className="text-xs text-blue-100">test@example.com / 123456</p>
          </div>
        </div>
      </div>
    </>
  );
} 