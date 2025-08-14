'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PayTRModules = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const modules = [
    {
      id: 'direkt-api',
      title: 'PayTR Direkt API',
      description: 'Kredi kartı bilgilerini doğrudan işleyen API entegrasyonu',
      features: [
        'Dinamik test kartı algılama',
        'Luhn algoritması ile kart doğrulama',
        '3D Secure desteği',
        'Otomatik test kartı yükleme',
        'Simüle edilmiş test ödemeleri',
        'Hash doğrulama ile güvenlik'
      ],
      testCards: [
        { number: '4355084355084358', brand: 'VISA', description: 'PayTR VISA Test Kartı' },
        { number: '5406675406675403', brand: 'MasterCard', description: 'PayTR MasterCard Test Kartı' },
        { number: '9792030394440796', brand: 'Troy', description: 'PayTR Troy Test Kartı' }
      ],
      route: '/paytr-test',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'link-api',
      title: 'PayTR Link API',
      description: 'Ödeme linki oluşturarak PayTR sayfasına yönlendirme',
      features: [
        'Dinamik ödeme linki oluşturma',
        'Kullanıcı bilgileri ile özelleştirme',
        'Test ortamında simülasyon',
        'Otomatik yönlendirme',
        'Callback URL yönetimi',
        'Güvenli token oluşturma'
      ],
      route: '/paytr-link-test',
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'status-inquiry',
      title: 'PayTR Status Inquiry API',
      description: 'İşlem durumunu sorgulama ve takip etme',
      features: [
        'Merchant OID ile durum sorgulama',
        'Gerçek zamanlı işlem takibi',
        'Test ortamında simülasyon',
        'Detaylı işlem bilgileri',
        'Hash doğrulama ile güvenlik',
        'Hata yönetimi ve loglama'
      ],
      route: '/paytr-status-inquiry',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'callback',
      title: 'PayTR Callback API',
      description: 'Ödeme sonuçlarını güvenli şekilde alma',
      features: [
        'Güvenli callback işleme',
        'Hash doğrulama',
        'Ödeme durumu kontrolü',
        'Veritabanı entegrasyonu',
        'Hata loglama',
        'Güvenlik kontrolleri'
      ],
      route: '/success',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const testCards = [
    {
      name: 'VISA Test Kartı',
      number: '4355084355084358',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'visa',
      description: 'PayTR VISA test kartı - Direkt API'
    },
    {
      name: 'MasterCard Test Kartı',
      number: '5406675406675403',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'mastercard',
      description: 'PayTR MasterCard test kartı - Direkt API'
    },
    {
      name: 'Troy Test Kartı',
      number: '9792030394440796',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'troy',
      description: 'PayTR Troy test kartı - Direkt API'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: '📊' },
    { id: 'modules', name: 'Modüller', icon: '🔧' },
    { id: 'test-cards', name: 'Test Kartları', icon: '💳' },
    { id: 'api-endpoints', name: 'API Endpoints', icon: '🔗' },
    { id: 'documentation', name: 'Dokümantasyon', icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">PayTR</h1>
                <p className="text-orange-200 text-sm">Modüller & Entegrasyonlar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/paytr-test"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Test Et
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">PayTR Entegrasyon Sistemi</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                PayTR'nin tüm API modüllerini kapsayan kapsamlı entegrasyon sistemi. 
                Test kartları ile dinamik ödeme işlemleri, güvenli callback yönetimi ve 
                gerçek zamanlı durum sorgulama özellikleri.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                    <span className="text-white font-bold text-lg">
                      {module.id === 'direkt-api' ? '💳' : 
                       module.id === 'link-api' ? '🔗' : 
                       module.id === 'status-inquiry' ? '🔍' : '📞'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{module.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{module.description}</p>
                  <Link 
                    href={module.route}
                    className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Test Et →
                  </Link>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Öne Çıkan Özellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Dinamik Test Kartı Algılama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Simüle Edilmiş Test Ortamı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Hash Doğrulama Güvenliği</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">3D Secure Desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Gerçek Zamanlı Durum Sorgulama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Kapsamlı Hata Yönetimi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">PayTR Modülleri</h2>
            
            {modules.map((module, index) => (
              <div key={module.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-300 text-lg">{module.description}</p>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-2xl">
                      {module.id === 'direkt-api' ? '💳' : 
                       module.id === 'link-api' ? '🔗' : 
                       module.id === 'status-inquiry' ? '🔍' : '📞'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-4">Özellikler</h4>
                    <ul className="space-y-2">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-4">Test Et</h4>
                    <Link 
                      href={module.route}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${module.color} text-white rounded-xl font-semibold hover:scale-105 transition-transform`}
                    >
                      {module.title} Test Sayfasına Git →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Cards Tab */}
        {activeTab === 'test-cards' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">PayTR Test Kartları</h2>
              <p className="text-gray-300 text-lg">
                PayTR Direkt API için resmi test kartları. Bu kartları girdiğinizde otomatik olarak algılanacak ve test modunda işlenecektir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testCards.map((card, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      card.brand === 'visa' ? 'bg-blue-500' :
                      card.brand === 'mastercard' ? 'bg-red-500' :
                      'bg-green-500'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {card.brand === 'visa' ? 'V' : card.brand === 'mastercard' ? 'M' : 'T'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{card.name}</h3>
                      <p className="text-gray-300 text-sm">{card.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Kart Numarası</div>
                      <div className="text-white font-mono">{card.number}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">CVV</div>
                        <div className="text-white font-mono">{card.cvv}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Son Kullanım</div>
                        <div className="text-white font-mono">{card.expiry}</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Kart Sahibi</div>
                      <div className="text-white">{card.holder}</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-orange-200 text-xs">
                      💡 Bu kart numarasını girdiğinizde otomatik olarak algılanacak ve test kartı olarak işaretlenecektir.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Test Kartı Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Otomatik kart türü algılama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Luhn algoritması doğrulama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Simüle edilmiş ödeme işlemi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Environment variables kontrolü</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Endpoints Tab */}
        {activeTab === 'api-endpoints' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">API Endpoints</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Backend API Routes</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm">POST /api/paytr/direkt-api</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Direkt API token oluşturma</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm">POST /api/paytr/link-api</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Link API ödeme linki oluşturma</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm">POST /api/paytr/status-inquiry</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Status Inquiry API durum sorgulama</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm">POST /api/paytr/callback</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR callback işleme</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm">GET /api/paytr/test-cards</div>
                    <div className="text-gray-400 text-xs mt-1">Test kartları listesi</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Frontend Pages</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-blue-400 font-mono text-sm">/paytr-test</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Direkt API test sayfası</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-blue-400 font-mono text-sm">/paytr-link-test</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Link API test sayfası</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-blue-400 font-mono text-sm">/paytr-status-inquiry</div>
                    <div className="text-gray-400 text-xs mt-1">PayTR Status Inquiry test sayfası</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-blue-400 font-mono text-sm">/success</div>
                    <div className="text-gray-400 text-xs mt-1">Başarılı ödeme sayfası</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-blue-400 font-mono text-sm">/fail</div>
                    <div className="text-gray-400 text-xs mt-1">Başarısız ödeme sayfası</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🔧 API Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Hash doğrulama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Environment variables</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Test modu desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Hata yönetimi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Debug bilgileri</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white">Simülasyon modu</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Dokümantasyon</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">📚 PayTR Resmi Dokümantasyon</h3>
                <div className="space-y-4">
                  <a 
                    href="https://dev.paytr.com/direkt-api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
                  >
                    <div className="text-blue-400 font-semibold">Direkt API</div>
                    <div className="text-gray-400 text-sm mt-1">Kredi kartı bilgilerini doğrudan işleme</div>
                  </a>
                  <a 
                    href="https://dev.paytr.com/link-api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
                  >
                    <div className="text-blue-400 font-semibold">Link API</div>
                    <div className="text-gray-400 text-sm mt-1">Ödeme linki oluşturma</div>
                  </a>
                  <a 
                    href="https://dev.paytr.com/durum-sorgu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
                  >
                    <div className="text-blue-400 font-semibold">Durum Sorgu API</div>
                    <div className="text-gray-400 text-sm mt-1">İşlem durumu sorgulama</div>
                  </a>
                  <a 
                    href="https://dev.paytr.com/moduller" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
                  >
                    <div className="text-blue-400 font-semibold">Modüller</div>
                    <div className="text-gray-400 text-sm mt-1">Tüm PayTR modülleri</div>
                  </a>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🔧 Kurulum & Konfigürasyon</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold">Environment Variables</div>
                    <div className="text-gray-400 text-sm mt-2">
                      <code className="bg-black/50 px-2 py-1 rounded text-xs">
                        PAYTR_MERCHANT_ID=your_merchant_id<br/>
                        PAYTR_MERCHANT_KEY=your_merchant_key<br/>
                        PAYTR_MERCHANT_SALT=your_merchant_salt
                      </code>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold">Test Modu</div>
                    <div className="text-gray-400 text-sm mt-1">
                      Environment variables ayarlanmamışsa otomatik simülasyon modu aktif olur
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold">Güvenlik</div>
                    <div className="text-gray-400 text-sm mt-1">
                      Tüm API istekleri hash doğrulama ile güvenli şekilde işlenir
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Hızlı Başlangıç</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Test Kartı Girin</h4>
                  <p className="text-gray-300 text-sm">PayTR test kartlarından birini kredi kartı formuna girin</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Otomatik Algılama</h4>
                  <p className="text-gray-300 text-sm">Kart otomatik olarak algılanacak ve test modunda işaretlenecek</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Ödeme İşlemi</h4>
                  <p className="text-gray-300 text-sm">Test kartı ile simüle edilmiş ödeme işlemi gerçekleştirilir</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayTRModules;




