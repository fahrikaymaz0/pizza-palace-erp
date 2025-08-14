'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🏢</div>
              <h1 className="text-2xl font-bold text-[#40B1D1]">Kaymaz Digital Solutions</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {mounted ? currentTime.toLocaleTimeString('en-US', { 
                  hour12: false 
                }) : '--:--:--'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Image
              src="/kaymaz-logo.png"
              alt="Kaymaz Digital Solutions"
              width={300}
              height={120}
              className="mx-auto mb-8"
              priority
            />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise Resource Planning
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Profesyonel ERP sistemi ile işletmenizi dijitalleştirin. 
            Müşteri yönetimi, proje takibi ve geliştirme süreçlerinizi tek platformda yönetin.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/admin/login"
              className="bg-[#40B1D1] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3a9bc7] transition-colors shadow-lg"
            >
              🔐 Admin Girişi
            </Link>
            <Link
              href="/pizza"
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              🍕 Pizza Web Sitesi
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Müşteri Yönetimi</h3>
              <p className="text-gray-600">
                Müşteri bilgilerini güvenli şekilde saklayın ve yönetin
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Proje Takibi</h3>
              <p className="text-gray-600">
                Geliştirme süreçlerini ve görevleri takip edin
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Erişim</h3>
              <p className="text-gray-600">
                Ultra güvenli admin paneli ile sistem yönetimi
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Sistem Durumu</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <div className="text-sm text-gray-600">Admin Panel</div>
                <div className="text-lg font-semibold text-green-600">Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <div className="text-sm text-gray-600">Pizza Web Sitesi</div>
                <div className="text-lg font-semibold text-green-600">Hazır</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <div className="text-sm text-gray-600">Veritabanı</div>
                <div className="text-lg font-semibold text-green-600">Çalışıyor</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <div className="text-sm text-gray-600">API Sistemi</div>
                <div className="text-lg font-semibold text-green-600">Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold mb-2">© 2024 Kaymaz Digital Solutions</p>
          <p className="text-sm text-gray-400 mb-4">Enterprise Resource Planning System</p>
          <p className="text-xs text-gray-500">
            Developed by <a href="https://github.com/fahoexe42" target="_blank" rel="noopener noreferrer" className="text-[#40B1D1] hover:text-[#3a9bc7] font-semibold">@fahoexe42</a>
          </p>
        </div>
      </footer>
    </div>
  );
} 