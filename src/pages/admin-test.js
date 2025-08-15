import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminTestPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@123');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  // API URL - Production'da localhost'a yönlendir
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api' 
    : '/api';

  const testHealthAPI = async () => {
    try {
      console.log('🧪 Testing Health API...');
      const response = await fetch(`${API_BASE}/health`);
      console.log('📡 Health API Status:', response.status);
      console.log('📡 Health API Headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📡 Health API Response:', data);
        setDebug(`✅ Health API OK: ${JSON.stringify(data, null, 2)}`);
      } else {
        setDebug(`❌ Health API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Health API Error:', error);
      setDebug(`❌ Health API Exception: ${error}`);
    }
  };

  const testAdminAPI = async () => {
    try {
      console.log('🧪 Testing Admin Login API...');
      const response = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📡 Admin API Status:', response.status);
      console.log('📡 Admin API Headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📡 Admin API Response:', data);
        setDebug(`✅ Admin API OK: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        console.log('📡 Admin API Error Text:', errorText);
        setDebug(`❌ Admin API Error: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Admin API Error:', error);
      setDebug(`❌ Admin API Exception: ${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebug('');

    try {
      console.log('🔄 ADMIN LOGIN - LOCALHOST BACKEND...');
      
      const response = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('📡 Error response text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📡 Admin login response:', data);

      if (data.success) {
        console.log('✅ Admin login successful, redirecting...');
        router.push('/admin');
      } else {
        setError(data.error || 'Giriş başarısız');
        setDebug(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      setError('Bağlantı hatası: ' + error);
      setDebug('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-20">
            <span className="text-2xl">🧪</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Test Sayfası
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Localhost Backend'e Bağlanıyor
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

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={testHealthAPI}
                className="py-2 px-4 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition duration-200 text-sm"
              >
                🧪 Health API
              </button>

              <button
                type="button"
                onClick={testAdminAPI}
                className="py-2 px-4 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition duration-200 text-sm"
              >
                🧪 Admin API
              </button>
            </div>
          </div>
        </form>

        {debug && (
          <div className="bg-black bg-opacity-50 p-4 rounded-lg">
            <p className="text-white text-sm font-medium mb-2">Debug Bilgileri:</p>
            <pre className="text-xs text-green-300 overflow-auto max-h-40">{debug}</pre>
          </div>
        )}

        <div className="text-center bg-white bg-opacity-10 p-4 rounded-lg">
          <p className="text-sm text-white font-medium mb-2">Test Admin:</p>
          <p className="text-xs text-blue-100">admin@123 / 123456</p>
          <p className="text-xs text-blue-100 mt-1">pizzapalaceofficial00@gmail.com / 123456</p>
          <p className="text-xs text-blue-100 mt-1">Backend: {API_BASE}</p>
          <p className="text-xs text-blue-100 mt-1">Environment: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
} 