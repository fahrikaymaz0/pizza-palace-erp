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
      const response = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setResult({ status: 'ERROR', data: { error: error instanceof Error ? error.message : 'Bilinmeyen hata' } });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setResult({ status: 'ERROR', data: { error: error instanceof Error ? error.message : 'Bilinmeyen hata' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Login */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="123456"
              />
            </div>
            
            <button
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '🔄 Test Login...' : '🔐 Test Login'}
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Test Kullanıcıları:</h3>
            <ul className="text-sm space-y-1">
              <li>• test@example.com / 123456 (user)</li>
              <li>• admin@123 / 123456 (admin)</li>
              <li>• pizzapalaceofficial00@gmail.com / 123456 (pizza_admin)</li>
            </ul>
          </div>
        </div>

        {/* Verify Token */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Verify Token</h2>
          
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? '🔄 Token Doğrula...' : '🔍 Token Doğrula'}
          </button>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Açıklama:</h3>
            <p className="text-sm text-gray-600">
              Bu buton mevcut cookie'deki token'ı doğrular. 
              Önce login yapmanız gerekir.
            </p>
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      {result && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sonuç</h2>
          
          <div className="mb-4">
            <span className="font-medium">Status: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              result.status === 200 ? 'bg-green-100 text-green-800' :
              result.status === 401 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {result.status}
            </span>
          </div>
          
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {/* Hata Çözümleri */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Hata Çözümleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-red-600">❌ 401 Hatası</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Token bulunamadı</li>
              <li>• Token süresi dolmuş</li>
              <li>• Geçersiz token</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-red-600">❌ 405 Hatası</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Yanlış HTTP metodu</li>
              <li>• Endpoint bulunamadı</li>
              <li>• Route yapılandırma hatası</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 