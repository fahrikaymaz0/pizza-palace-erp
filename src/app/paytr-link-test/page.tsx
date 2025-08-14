'use client';
import React, { useState } from 'react';
import { createTestPaymentLink } from '@/lib/paymentAPI';

export default function PayTRLinkTestPage() {
  const [paymentData, setPaymentData] = useState({
    email: 'test@paytr.com',
    amount: 100,
    user_name: 'Test User',
    user_address: 'Test Address',
    user_phone: '05555555555',
    user_basket: JSON.stringify([['Test Product', '100.00', 1]])
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePaymentLink = async () => {
    if (!paymentData.email || !paymentData.amount) {
      alert('Lütfen email ve tutar bilgilerini girin!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🔗 PayTR Link API test başlatılıyor...');
      const linkResult = await createTestPaymentLink(paymentData);
      setResult(linkResult);

      if (linkResult.success) {
        console.log('✅ PayTR Link API test başarılı!');
        console.log('🔗 Ödeme URL:', linkResult.payment_url);
        
        // Kullanıcıyı PayTR ödeme sayfasına yönlendir
        if (linkResult.payment_url) {
          window.location.href = linkResult.payment_url;
        }
      } else {
        console.error('❌ PayTR Link API test başarısız:', linkResult);
      }
    } catch (error: any) {
      console.error('❌ PayTR Link API test hatası:', error);
      setResult({
        success: false,
        error: error.message || 'Bilinmeyen hata'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🔗 PayTR Link API Test
            </h1>
            <p className="text-gray-600">
              PayTR Link API ile ödeme linki oluşturma testi
            </p>
          </div>

          {/* Test Formu */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Test Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="test@paytr.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutar (TL) *
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={paymentData.user_name}
                  onChange={(e) => setPaymentData({...paymentData, user_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Test User"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="text"
                  value={paymentData.user_phone}
                  onChange={(e) => setPaymentData({...paymentData, user_phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="05555555555"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <input
                  type="text"
                  value={paymentData.user_address}
                  onChange={(e) => setPaymentData({...paymentData, user_address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Test Address"
                />
              </div>
            </div>
          </div>

          {/* Test Butonu */}
          <div className="text-center mb-6">
            <button
              onClick={handlePaymentLink}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  🔗 Test Linki Oluşturuluyor...
                </span>
              ) : (
                '🔗 Test Ödeme Linki Oluştur'
              )}
            </button>
          </div>

          {/* Test Sonucu */}
          {result && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📡 Test Sonucu
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Durum:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '✅ Başarılı' : '❌ Başarısız'}
                  </span>
                </div>
                
                {result.success && (
                  <>
                    <div>
                      <span className="font-medium">İşlem No:</span>
                      <span className="ml-2 font-mono text-sm">{result.transactionId}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Token:</span>
                      <span className="ml-2 font-mono text-sm break-all">{result.token}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Ödeme URL:</span>
                      <a 
                        href={result.payment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {result.payment_url}
                      </a>
                    </div>
                    
                    <div>
                      <span className="font-medium">Tutar:</span>
                      <span className="ml-2">₺{result.amount}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Mesaj:</span>
                      <span className="ml-2 text-gray-600">{result.message}</span>
                    </div>
                    
                    {(result as any).isSimulated && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <span className="text-yellow-800 text-sm">
                          🎮 Bu bir simüle edilmiş test sonucudur. Environment variables ayarlanmamış.
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {result.error && (
                  <div>
                    <span className="font-medium">Hata:</span>
                    <span className="ml-2 text-red-600">{result.error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bilgi Kutusu */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              ℹ️ PayTR Link API Test Hakkında
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• PayTR Link API, ödeme linki oluşturur ve kullanıcıyı PayTR ödeme sayfasına yönlendirir</li>
              <li>• Kredi kartı bilgileri PayTR tarafında güvenli şekilde işlenir</li>
              <li>• Test modunda çalışır, gerçek ödeme yapılmaz</li>
              <li>• Environment variables ayarlanmamışsa simülasyon çalışır</li>
              <li>• Başarılı test sonrası PayTR ödeme sayfasına otomatik yönlendirme yapılır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}




