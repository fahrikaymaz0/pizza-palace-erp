'use client';

import React, { useState } from 'react';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);

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
      setResult({ status: response.status, data });

      if (data.success) {
        console.log('✅ Test login başarılı:', data);
      } else {
        console.error('❌ Test login hatası:', data);
      }
    } catch (error) {
      console.error('❌ Network hatası:', error);
      setResult({
        status: 'ERROR',
        data: {
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/v2/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      setResult({ status: response.status, data });

      if (data.success) {
        console.log('✅ Token doğrulandı:', data);
      } else {
        console.log('ℹ️ Token doğrulanamadı:', data);
      }
    } catch (error) {
      console.error('❌ Network hatası:', error);
      setResult({
        status: 'ERROR',
        data: {
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/v2/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: '123456',
        }),
      });

      const data = await response.json();
      setResult({ status: response.status, data });

      if (data.success) {
        console.log('✅ Test register başarılı:', data);
      } else {
        console.error('❌ Test register hatası:', data);
      }
    } catch (error) {
      console.error('❌ Network hatası:', error);
      setResult({
        status: 'ERROR',
        data: {
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔧 API Test Sayfası</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Login Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔐 Login Test</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Test Ediliyor...' : 'Login Test Et'}
            </button>
          </div>
        </div>

        {/* Verify Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">✅ Token Verify Test</h2>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Test Ediliyor...' : 'Token Doğrula'}
          </button>
        </div>

        {/* Register Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📝 Register Test</h2>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Test Ediliyor...' : 'Register Test Et'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">📊 Test Sonucu:</h3>
          <pre className="bg-white p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Test Kullanıcıları */}
      <div className="mt-6 bg-yellow-50 p-4 rounded">
        <h3 className="font-semibold mb-2">🧪 Test Kullanıcıları:</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>Normal Kullanıcı:</strong> test@example.com / 123456</li>
          <li><strong>Pizza Admin:</strong> pizzapalaceofficial00@gmail.com / 123456</li>
          <li><strong>Admin:</strong> admin@123 / 123456</li>
        </ul>
      </div>
    </div>
  );
}
