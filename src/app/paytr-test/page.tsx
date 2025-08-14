'use client';

import React, { useState } from 'react';
import { makeTestPayment } from '@/lib/paymentAPI';

export default function PayTRTestPage() {
  const [cardData, setCardData] = useState({
    number: '',
    holder: 'PAYTR TEST',
    expiry: '12/30',
    cvv: '000',
  });
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // PayTR Resmi Test Kartları
  const paytrTestCards = [
    {
      name: 'VISA Test Kartı',
      number: '4355084355084358',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'VISA',
    },
    {
      name: 'MasterCard Test Kartı',
      number: '5406675406675403',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'MasterCard',
    },
    {
      name: 'Troy Test Kartı',
      number: '9792030394440796',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'Troy',
    },
  ];

  const handleCardSelect = (card: any) => {
    setCardData({
      number: card.number,
      holder: card.holder,
      expiry: card.expiry,
      cvv: card.cvv,
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const paymentResult = await makeTestPayment(cardData, amount);
      setResult(paymentResult);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PayTR Direkt API Test Sayfası
            </h1>
            <p className="text-gray-600">
              PayTR&apos;nin resmi test kartları ile ödeme işlemi test edin
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                📋 <strong>PayTR Resmi Dokümantasyon:</strong>{' '}
                <a
                  href="https://dev.paytr.com/direkt-api/test-kart-bilgileri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Test Kart Bilgileri
                </a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Taraf - Test Kartları */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                PayTR Resmi Test Kartları
              </h2>
              <div className="space-y-4">
                {paytrTestCards.map((card, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      cardData.number === card.number
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-mono">
                          {card.number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {card.holder} | {card.expiry} | CVV: {card.cvv}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                          {card.brand}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ℹ️ Test Kartları Hakkında
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Bu kartlar sadece test amaçlıdır</li>
                  <li>• Gerçek ödeme yapmaz</li>
                  <li>• PayTR Direkt API ile uyumludur</li>
                  <li>• Ad-soyad ve son kullanma tarihi değiştirilebilir</li>
                </ul>
              </div>
            </div>

            {/* Sağ Taraf - Ödeme Formu */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ödeme Bilgileri
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar (₺)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={e =>
                      setCardData({ ...cardData, number: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="4355 0843 5508 4358"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kart Sahibi
                  </label>
                  <input
                    type="text"
                    value={cardData.holder}
                    onChange={e =>
                      setCardData({ ...cardData, holder: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PAYTR TEST"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Son Kullanma
                    </label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={e =>
                        setCardData({ ...cardData, expiry: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={e =>
                        setCardData({ ...cardData, cvv: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || !cardData.number}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Ödeme İşleniyor...
                    </div>
                  ) : (
                    'Ödeme Yap'
                  )}
                </button>
              </div>

              {/* Sonuç */}
              {result && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    result.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <h3
                    className={`font-semibold mb-2 ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.success ? '✅ Başarılı' : '❌ Hata'}
                  </h3>
                  <div className="text-sm space-y-1">
                    {result.success ? (
                      <>
                        <p>
                          <strong>İşlem No:</strong> {result.transactionId}
                        </p>
                        <p>
                          <strong>Banka:</strong> {result.bank}
                        </p>
                        <p>
                          <strong>Tutar:</strong> ₺{result.amount}
                        </p>
                        <p>
                          <strong>Mesaj:</strong> {result.message}
                        </p>
                        {result.isTestCard && (
                          <p className="text-blue-600">
                            🎯 PayTR Test Kartı kullanıldı
                          </p>
                        )}
                        {result.isSimulated && (
                          <p className="text-purple-600">
                            🎮 Simüle edilmiş test ödeme
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Hata:</strong> {result.error}
                        </p>
                        <p>
                          <strong>Mesaj:</strong> {result.friendlyMessage}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
