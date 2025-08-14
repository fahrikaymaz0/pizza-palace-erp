'use client';

import { useState } from 'react';

export default function OrdersTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testOrdersAPI = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    
    try {
      console.log('🔄 Orders API test başlatılıyor...');
      
      const response = await fetch('/api/pizza/orders', {
        credentials: 'include',
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📦 API Response:', data);
      
      setResult(data);
      
      if (response.ok && data.success) {
        console.log('✅ API başarılı');
      } else {
        console.error('❌ API başarısız');
        setError(data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('❌ Test hatası:', error);
      setError(`Hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders API Test</h1>
          <p className="text-gray-600">Orders API'sini test etmek için kullanın</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={testOrdersAPI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Test ediliyor...
              </div>
            ) : (
              'Orders API Test Et'
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 font-medium">Hata: {error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">API Yanıtı:</h3>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Bilgi:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Bu sayfa sadece development ortamında çalışır</li>
              <li>• Orders API'sini test etmek için kullanın</li>
              <li>• Console'da detaylı logları görebilirsiniz</li>
              <li>• Giriş yapmış olmanız gerekiyor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



