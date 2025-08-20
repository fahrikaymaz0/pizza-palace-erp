'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // URL'den ödeme detaylarını al
    const merchant_oid = searchParams.get('merchant_oid');
    const status = searchParams.get('status');
    const total_amount = searchParams.get('total_amount');

    if (merchant_oid && status && total_amount) {
      setPaymentDetails({
        merchant_oid,
        status,
        total_amount: (parseInt(total_amount) / 100).toFixed(2), // Kuruştan TL'ye çevir
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Ödeme Başarılı!</h1>
        <p className="text-green-200 mb-6">
          PayTR ile yapılan ödeme işlemi başarıyla tamamlandı.
        </p>

        {paymentDetails && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Ödeme Detayları</h3>
            <div className="space-y-2 text-sm text-green-100">
              <div className="flex justify-between">
                <span>Sipariş No:</span>
                <span className="font-mono">{paymentDetails.merchant_oid}</span>
              </div>
              <div className="flex justify-between">
                <span>Tutar:</span>
                <span className="font-bold">
                  {paymentDetails.total_amount} TL
                </span>
              </div>
              <div className="flex justify-between">
                <span>Durum:</span>
                <span className="text-green-300 font-semibold">Başarılı</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = '/paytr-test')}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Yeni Test Yap
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Ana Sayfaya Dön
          </button>
        </div>

        <div className="mt-6 text-xs text-green-200 opacity-70">
          PayTR API entegrasyonu ile güvenli ödeme
        </div>
      </div>
    </div>
  );
}




