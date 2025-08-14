'use client';

import React, { useState, useEffect } from 'react';

const PayTRStatusInquiry = () => {
  const [merchantOid, setMerchantOid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState('disconnected');

  // Test merchant OID'leri
  const TEST_MERCHANT_OIDS = [
    'PAYTR_TEST_123456789',
    'PAYTR_LINK_987654321',
    'ORDER_123456789',
    'PAYTR_123456789',
  ];

  // PayTR Status Inquiry API testi
  const testPayTRStatusInquiry = async () => {
    setApiStatus('testing');
    setDebugInfo(null);

    try {
      const testData = {
        merchant_oid: 'PAYTR_TEST_' + Date.now(),
      };

      console.log('Status Inquiry test verisi gönderiliyor:', testData);

      const response = await fetch('/api/paytr/status-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      setApiResponse(result);
      setDebugInfo(result.debug_info);

      console.log('Status Inquiry API Test sonucu:', result);

      if (result.success) {
        setApiStatus('connected');
        return true;
      } else {
        setApiStatus('disconnected');
        return false;
      }
    } catch (error) {
      console.error('PayTR Status Inquiry API testi başarısız:', error);
      setApiStatus('disconnected');
      return false;
    }
  };

  // Status Inquiry işlemi
  const checkTransactionStatus = async () => {
    if (!merchantOid.trim()) {
      alert('Lütfen bir işlem numarası (Merchant OID) girin!');
      return;
    }

    setIsProcessing(true);
    setDebugInfo(null);

    try {
      const requestData = {
        merchant_oid: merchantOid.trim(),
      };

      console.log('Status Inquiry isteği gönderiliyor:', requestData);

      const response = await fetch('/api/paytr/status-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      setApiResponse(result);
      setDebugInfo(result.debug_info);

      console.log('Status Inquiry sonucu:', result);

      if (result.success) {
        console.log('✅ İşlem durumu başarıyla sorgulandı');
      } else {
        console.error('❌ Status Inquiry hatası:', result.error);
      }
    } catch (error) {
      console.error('Status Inquiry hatası:', error);
      alert(
        'İşlem durumu sorgulanırken hata oluştu: ' + (error as Error).message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Test OID seçimi
  const selectTestOid = (oid: string) => {
    setMerchantOid(oid);
  };

  // Component mount
  useEffect(() => {
    testPayTRStatusInquiry();
  }, []);

  // API Status indicator
  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return 'text-green-400';
      case 'testing':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return 'PayTR Status Inquiry API Bağlantısı OK';
      case 'testing':
        return 'PayTR Status Inquiry API Test Ediliyor...';
      default:
        return 'PayTR Status Inquiry API Bağlantısı Yok';
    }
  };

  // Status badge rengi
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* PayTR Header */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">PayTR</h1>
          <p className="text-orange-200 text-sm">Status Inquiry API</p>
          <div className={`text-xs ${getApiStatusColor()}`}>
            {getApiStatusText()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full flex flex-col gap-8 items-center mt-16 lg:mt-0">
        {/* Test Merchant OID'leri */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-4 text-center">
            Test İşlem Numaraları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {TEST_MERCHANT_OIDS.map((oid, index) => (
              <button
                key={index}
                onClick={() => selectTestOid(oid)}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all text-left"
              >
                <div className="text-white font-semibold text-sm">{oid}</div>
                <div className="text-white/70 text-xs">Test işlem numarası</div>
              </button>
            ))}
          </div>
          <p className="text-center text-yellow-300 text-xs italic">
            Bu işlem numaralarından birini seçerek test edebilirsiniz
          </p>
        </div>

        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Debug Info */}
          {debugInfo && (
            <div className="backdrop-blur-sm rounded-xl p-4 mb-6 border border-yellow-400/30 bg-yellow-500/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  🔍
                </div>
                <span className="text-sm font-semibold text-yellow-200">
                  Debug Bilgileri
                </span>
              </div>
              <div className="space-y-2 text-xs text-yellow-100">
                {debugInfo.hash_string && (
                  <div>• Hash: {debugInfo.hash_string.substring(0, 20)}...</div>
                )}
                {debugInfo.token_generated && (
                  <div>
                    • Token: {debugInfo.token_generated.substring(0, 20)}...
                  </div>
                )}
                {debugInfo.raw_response && (
                  <div>• Response: {debugInfo.raw_response}</div>
                )}
                {debugInfo.note && <div>• Not: {debugInfo.note}</div>}
              </div>
            </div>
          )}

          {/* API Response */}
          {apiResponse && (
            <div
              className={`backdrop-blur-sm rounded-xl p-4 mb-6 border ${
                apiResponse.success
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30'
                  : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    apiResponse.success ? 'bg-green-400' : 'bg-red-400'
                  }`}
                >
                  {apiResponse.success ? '✓' : '✗'}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    apiResponse.success ? 'text-green-200' : 'text-red-200'
                  }`}
                >
                  {apiResponse.success
                    ? 'Status Inquiry Başarılı'
                    : 'Status Inquiry Hatası'}
                </span>
              </div>
              <div
                className={`space-y-2 text-xs ${
                  apiResponse.success ? 'text-green-100' : 'text-red-100'
                }`}
              >
                <div>
                  • API Türü: {apiResponse.api_type || 'Status Inquiry API'}
                </div>
                <div>• İşlem No: {apiResponse.merchant_oid}</div>
                {apiResponse.status && (
                  <div className="flex items-center gap-2">
                    <span>• Durum:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(apiResponse.status)}`}
                    >
                      {apiResponse.status.toUpperCase()}
                    </span>
                  </div>
                )}
                {apiResponse.total_amount && (
                  <div>
                    • Tutar: ₺
                    {(parseInt(apiResponse.total_amount) / 100).toFixed(2)}
                  </div>
                )}
                {apiResponse.payment_type && (
                  <div>
                    • Ödeme Türü: {apiResponse.payment_type.toUpperCase()}
                  </div>
                )}
                {apiResponse.currency && (
                  <div>• Para Birimi: {apiResponse.currency}</div>
                )}
                {apiResponse.test_mode && (
                  <div>• Mod: {apiResponse.test_mode}</div>
                )}
                {apiResponse.is_simulated && <div>• Simüle Edilmiş: Evet</div>}
                <div>• Mesaj: {apiResponse.message}</div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Merchant OID Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                İşlem Numarası (Merchant OID)
              </label>
              <input
                type="text"
                value={merchantOid}
                onChange={e => setMerchantOid(e.target.value)}
                placeholder="PAYTR_TEST_123456789"
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 font-medium"
              />
            </div>

            {/* API Test Button */}
            <button
              type="button"
              onClick={testPayTRStatusInquiry}
              disabled={apiStatus === 'testing'}
              className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              {apiStatus === 'testing'
                ? 'API Test Ediliyor...'
                : 'PayTR Status Inquiry API Test Et'}
            </button>

            {/* Status Inquiry Button */}
            <button
              type="button"
              onClick={checkTransactionStatus}
              disabled={isProcessing || !merchantOid.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                isProcessing
                  ? 'bg-gray-500 cursor-not-allowed'
                  : merchantOid.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg active:scale-95'
                    : 'bg-gray-600 cursor-not-allowed'
              } text-white shadow-xl`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Durum Sorgulanıyor...</span>
                </div>
              ) : (
                'İşlem Durumunu Sorgula'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-400/30">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                ℹ️
              </div>
              <div className="text-sm text-blue-100">
                <div className="font-semibold mb-2">
                  PayTR Status Inquiry API
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    • İşlem durumunu sorgulamak için merchant_oid gerekli
                  </div>
                  <div>• Test ortamında simüle edilmiş yanıtlar döner</div>
                  <div>• Canlı ortamda gerçek PayTR API kullanılır</div>
                  <div>• Hash doğrulama ile güvenli sorgulama</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayTRStatusInquiry;
