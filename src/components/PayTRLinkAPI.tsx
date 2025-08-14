'use client';
import React, { useState, useEffect } from 'react';

const PayTRLinkAPI = () => {
  const [paymentData, setPaymentData] = useState({
    email: 'test@paytr.com',
    payment_amount: '10000', // 100.00 TL (kuruş cinsinden)
    user_name: 'Test User',
    user_address: 'Test Address',
    user_phone: '05555555555',
    user_basket: JSON.stringify([['Test Product', '100.00', 1]]),
    timeout_limit: '30',
    no_installment: '0',
    max_installment: '0',
    currency_rate: '1',
    lang: 'tr'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [userIP, setUserIP] = useState<string>('');

  // Kullanıcı IP'sini al
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('IP alma hatası:', error);
      return '127.0.0.1';
    }
  };

  // PayTR Link API test bağlantısı
  const testPayTRLinkAPI = async () => {
    try {
      console.log('🔗 PayTR Link API test bağlantısı yapılıyor...');
      
      const testData = {
        user_ip: userIP,
        merchant_oid: `TEST_${Date.now()}`,
        email: 'test@paytr.com',
        payment_amount: '10000',
        payment_type: 'card',
        installment_count: '0',
        currency: 'TL',
        test_mode: '1',
        non_3d: '0',
        merchant_ok_url: `${window.location.origin}/success`,
        merchant_fail_url: `${window.location.origin}/fail`,
        user_name: 'Test User',
        user_address: 'Test Address',
        user_phone: '05555555555',
        user_basket: JSON.stringify([['Test Product', '100.00', 1]]),
        timeout_limit: '30',
        debug_on: '1',
        client_lang: 'tr',
        no_installment: '0',
        max_installment: '0',
        currency_rate: '1',
        lang: 'tr'
      };

      const response = await fetch('/api/paytr/link-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      console.log('🔗 PayTR Link API test sonucu:', result);
      
      if (result.success) {
        console.log('✅ PayTR Link API bağlantısı başarılı!');
        console.log('🔗 Ödeme Linki:', result.payment_url);
      } else {
        console.log('❌ PayTR Link API bağlantısı başarısız:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('🔗 PayTR Link API test hatası:', error);
      return { success: false, error: 'Bağlantı hatası' };
    }
  };

  // Ödeme linki oluştur
  const createPaymentLink = async () => {
    if (!paymentData.email || !paymentData.payment_amount) {
      alert('Lütfen email ve ödeme tutarını girin!');
      return;
    }

    setIsProcessing(true);
    
    try {
      const merchantOid = `PAYTR_LINK_${Date.now()}`;
      
      const requestData = {
        user_ip: userIP,
        merchant_oid: merchantOid,
        email: paymentData.email,
        payment_amount: paymentData.payment_amount,
        payment_type: 'card',
        installment_count: '0',
        currency: 'TL',
        test_mode: '1',
        non_3d: '0',
        merchant_ok_url: `${window.location.origin}/success`,
        merchant_fail_url: `${window.location.origin}/fail`,
        user_name: paymentData.user_name,
        user_address: paymentData.user_address,
        user_phone: paymentData.user_phone,
        user_basket: paymentData.user_basket,
        timeout_limit: paymentData.timeout_limit,
        debug_on: '1',
        client_lang: 'tr',
        no_installment: paymentData.no_installment,
        max_installment: paymentData.max_installment,
        currency_rate: paymentData.currency_rate,
        lang: paymentData.lang
      };

      console.log('🔗 PayTR Link API ödeme linki oluşturuluyor...');
      console.log('📋 Ödeme verisi:', requestData);

      const response = await fetch('/api/paytr/link-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      setApiResponse(result);
      setDebugInfo(result.debug_info);

      console.log('🔗 PayTR Link API sonucu:', result);

      if (result.success) {
        console.log('✅ Ödeme linki oluşturuldu!');
        console.log('🔗 Ödeme URL:', result.payment_url);
        
        // Kullanıcıyı PayTR ödeme sayfasına yönlendir
        window.location.href = result.payment_url;
      } else {
        let errorMessage = `PayTR Link API Hatası: ${result.error}\n\n`;
        
        if (result.error === 'ENV_ERROR') {
          errorMessage += '⚠️ Environment Variables Ayarlanmamış!\n\n' +
                         'Lütfen .env.local dosyasında PayTR bilgilerinizi ayarlayın.\n\n';
        }
        
        errorMessage += `Oluşturulan veri:\n` + 
                       `Email: ${paymentData.email}\nTutar: ${(parseInt(paymentData.payment_amount) / 100).toFixed(2)} TL\nKullanıcı: ${paymentData.user_name}`;
        
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('🔗 Ödeme linki oluşturma hatası:', error);
      alert('Ödeme linki oluşturulurken hata oluştu: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Component mount
  useEffect(() => {
    const init = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
      await testPayTRLinkAPI();
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🔗 PayTR Link API
            </h1>
            <p className="text-gray-600">
              PayTR Link API ile ödeme linki oluşturun ve kullanıcıyı PayTR ödeme sayfasına yönlendirin
            </p>
          </div>

          {/* Ödeme Bilgileri Formu */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Ödeme Bilgileri
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
                  Ödeme Tutarı (Kuruş) *
                </label>
                <input
                  type="number"
                  value={paymentData.payment_amount}
                  onChange={(e) => setPaymentData({...paymentData, payment_amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10000 (100.00 TL)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {paymentData.payment_amount ? `${(parseInt(paymentData.payment_amount) / 100).toFixed(2)} TL` : '0.00 TL'}
                </p>
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

          {/* Ödeme Linki Oluştur Butonu */}
          <div className="text-center mb-6">
            <button
              onClick={createPaymentLink}
              disabled={isProcessing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  🔗 Ödeme Linki Oluşturuluyor...
                </span>
              ) : (
                '🔗 Ödeme Linki Oluştur'
              )}
            </button>
          </div>

          {/* API Yanıtı */}
          {apiResponse && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📡 API Yanıtı
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Durum:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    apiResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {apiResponse.success ? '✅ Başarılı' : '❌ Başarısız'}
                  </span>
                </div>
                
                {apiResponse.success && (
                  <div>
                    <span className="font-medium">Ödeme URL:</span>
                    <a 
                      href={apiResponse.payment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {apiResponse.payment_url}
                    </a>
                  </div>
                )}
                
                {apiResponse.error && (
                  <div>
                    <span className="font-medium">Hata:</span>
                    <span className="ml-2 text-red-600">{apiResponse.error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Debug Bilgileri */}
          {debugInfo && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🔍 Debug Bilgileri
              </h3>
              
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Merchant ID:</span> {debugInfo.merchant_id}</div>
                <div><span className="font-medium">Test Mode:</span> {debugInfo.test_mode}</div>
                <div><span className="font-medium">User IP:</span> {userIP}</div>
                <div><span className="font-medium">Hash String:</span> 
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs break-all">
                    {debugInfo.hash_string}
                  </div>
                </div>
                <div><span className="font-medium">Generated Token:</span> 
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs break-all">
                    {debugInfo.generated_token}
                  </div>
                </div>
                <div><span className="font-medium">Raw Response:</span> 
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs break-all">
                    {debugInfo.raw_response}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bilgi Kutusu */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              ℹ️ PayTR Link API Hakkında
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• PayTR Link API, kullanıcıyı PayTR'nin ödeme sayfasına yönlendirir</li>
              <li>• Kredi kartı bilgileri PayTR tarafında güvenli şekilde işlenir</li>
              <li>• Test modunda çalışır, gerçek ödeme yapılmaz</li>
              <li>• Ödeme sonucu callback URL'lerine yönlendirilir</li>
              <li>• Environment variables ayarlanmamışsa test simülasyonu çalışır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayTRLinkAPI;




