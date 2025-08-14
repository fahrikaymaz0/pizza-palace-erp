'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FailPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // URL'den ödeme detaylarını al
    const merchant_oid = searchParams.get('merchant_oid');
    const status = searchParams.get('status');
    const failed_reason_code = searchParams.get('failed_reason_code');
    const failed_reason_msg = searchParams.get('failed_reason_msg');

    if (merchant_oid) {
      setPaymentDetails({
        merchant_oid,
        status,
        failed_reason_code,
        failed_reason_msg,
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
        {/* Fail Icon */}
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Ödeme Başarısız!</h1>
        <p className="text-red-200 mb-6">
          PayTR ile yapılan ödeme işlemi tamamlanamadı.
        </p>

        {paymentDetails && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Hata Detayları</h3>
            <div className="space-y-2 text-sm text-red-100">
              <div className="flex justify-between">
                <span>Sipariş No:</span>
                <span className="font-mono">{paymentDetails.merchant_oid}</span>
              </div>
              <div className="flex justify-between">
                <span>Durum:</span>
                <span className="text-red-300 font-semibold">Başarısız</span>
              </div>
              {paymentDetails.failed_reason_code && (
                <div className="flex justify-between">
                  <span>Hata Kodu:</span>
                  <span className="font-mono">
                    {paymentDetails.failed_reason_code}
                  </span>
                </div>
              )}
              {paymentDetails.failed_reason_msg && (
                <div className="text-left mt-3 p-3 bg-red-500/20 rounded-lg">
                  <div className="text-xs text-red-200 mb-1">Hata Mesajı:</div>
                  <div className="text-sm">
                    {paymentDetails.failed_reason_msg}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = '/paytr-test')}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Tekrar Dene
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Ana Sayfaya Dön
          </button>
        </div>

        <div className="mt-6 text-xs text-red-200 opacity-70">
          PayTR API entegrasyonu ile güvenli ödeme
        </div>
      </div>
    </div>
  );
}
