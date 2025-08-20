'use client';

import { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { Clock, Star, Truck, Percent, Flame, Gift, Calendar, MapPin } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    title: "🔥 2 Pizza 1 Fiyat",
    description: "Herhangi 2 pizzayı sipariş ver, 1 tanesini bedava al!",
    discount: 50,
    originalPrice: 199.98,
    discountedPrice: 99.99,
    validUntil: "2024-12-31",
    image: "/images/campaigns/2-for-1.jpg",
    category: "Pizza",
    isHot: true,
    isNew: false,
    terms: [
      "Aynı boyutta pizzalar seçilmelidir",
      "En düşük fiyatlı pizza ücretsizdir",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "2FOR1"
  },
  {
    id: 2,
    title: "🎉 İlk Sipariş %30 İndirim",
    description: "İlk siparişinizde %30 indirim fırsatı!",
    discount: 30,
    originalPrice: 150,
    discountedPrice: 105,
    validUntil: "2024-12-31",
    image: "/images/campaigns/first-order.jpg",
    category: "Tüm Menü",
    isHot: false,
    isNew: true,
    terms: [
      "Sadece ilk sipariş için geçerlidir",
      "Minimum sipariş tutarı: 50 TL",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "FIRST30"
  },
  {
    id: 3,
    title: "⚡ Hızlı Teslimat %20 İndirim",
    description: "30 dakika içinde teslimat garantisi!",
    discount: 20,
    originalPrice: 120,
    discountedPrice: 96,
    validUntil: "2024-12-31",
    image: "/images/campaigns/fast-delivery.jpg",
    category: "Teslimat",
    isHot: true,
    isNew: false,
    terms: [
      "30 dakika içinde teslimat garantisi",
      "Gecikme durumunda %20 iade",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "FAST20"
  },
  {
    id: 4,
    title: "🍕 Aile Menüsü Paketi",
    description: "4 kişilik aile için özel paket!",
    discount: 35,
    originalPrice: 299.96,
    discountedPrice: 194.97,
    validUntil: "2024-12-31",
    image: "/images/campaigns/family-pack.jpg",
    category: "Paket",
    isHot: false,
    isNew: true,
    terms: [
      "2 büyük pizza",
      "1 yan ürün",
      "1 tatlı",
      "2 içecek",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "FAMILY35"
  },
  {
    id: 5,
    title: "🎂 Doğum Günü Özel",
    description: "Doğum gününüzde %25 indirim!",
    discount: 25,
    originalPrice: 200,
    discountedPrice: 150,
    validUntil: "2024-12-31",
    image: "/images/campaigns/birthday.jpg",
    category: "Özel",
    isHot: false,
    isNew: false,
    terms: [
      "Doğum günü belgesi gerekli",
      "Sadece doğum gününde geçerli",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "BIRTHDAY25"
  },
  {
    id: 6,
    title: "🌙 Gece Yarısı Fırsatı",
    description: "22:00-02:00 arası %40 indirim!",
    discount: 40,
    originalPrice: 180,
    discountedPrice: 108,
    validUntil: "2024-12-31",
    image: "/images/campaigns/midnight.jpg",
    category: "Zamanlı",
    isHot: true,
    isNew: false,
    terms: [
      "Sadece 22:00-02:00 arası geçerli",
      "Minimum sipariş tutarı: 100 TL",
      "Geçerli: 31 Aralık 2024'e kadar"
    ],
    code: "MIDNIGHT40"
  }
];

const categories = [
  { id: 'all', name: 'Tümü', icon: '🎯' },
  { id: 'Pizza', name: 'Pizza', icon: '🍕' },
  { id: 'Tüm Menü', name: 'Tüm Menü', icon: '🍽️' },
  { id: 'Teslimat', name: 'Teslimat', icon: '🚚' },
  { id: 'Paket', name: 'Paket', icon: '📦' },
  { id: 'Özel', name: 'Özel', icon: '🎁' },
  { id: 'Zamanlı', name: 'Zamanlı', icon: '⏰' }
];

export default function Campaigns() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCategory === 'all' || campaign.category === selectedCategory
  );

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const addToCart = (campaign) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === campaign.id);
      if (existing) {
        return prev.map(item =>
          item.id === campaign.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...campaign, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <>
      <Head>
        <title>Kampanyalar - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı'nın özel kampanyaları ve indirimleri. En iyi fırsatları kaçırmayın!" />
        <meta name="keywords" content="pizza kampanyaları, indirim, fırsat, özel teklif, pizza krallığı" />
        <meta property="og:title" content="Kampanyalar - Pizza Krallığı" />
        <meta property="og:description" content="Pizza Krallığı'nın özel kampanyaları ve indirimleri. En iyi fırsatları kaçırmayın!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kampanyalar - Pizza Krallığı" />
        <meta name="twitter:description" content="Pizza Krallığı'nın özel kampanyaları ve indirimleri. En iyi fırsatları kaçırmayın!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                🎉 Özel Kampanyalar
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                En iyi fırsatları kaçırmayın! Özel indirimler ve kampanyalar
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">6</div>
                  <div className="text-sm opacity-90">Aktif Kampanya</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">%50</div>
                  <div className="text-sm opacity-90">En Yüksek İndirim</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Kampanya Desteği</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">∞</div>
                  <div className="text-sm opacity-90">Sınırsız Fırsat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Campaign Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    {campaign.isHot && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        SICAK
                      </span>
                    )}
                    {campaign.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-2">
                        <Gift className="w-3 h-3" />
                        YENİ
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">%{campaign.discount}</div>
                        <div className="text-xs text-gray-600">İNDİRİM</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Geçerli: {new Date(campaign.validUntil).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {campaign.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl font-bold text-red-600">
                      ₺{campaign.discountedPrice}
                    </div>
                    <div className="text-lg text-gray-400 line-through">
                      ₺{campaign.originalPrice}
                    </div>
                    <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      %{campaign.discount} Tasarruf
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Şartlar:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {campaign.terms.map((term, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyCode(campaign.code)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copiedCode === campaign.code
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copiedCode === campaign.code ? 'Kopyalandı!' : `Kod: ${campaign.code}`}
                    </button>
                    <button
                      onClick={() => addToCart(campaign)}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      Kullan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Kampanya bulunamadı
              </h3>
              <p className="text-gray-500">
                Seçilen kategoride aktif kampanya bulunmuyor.
              </p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          setCart={setCart}
        />

        <Footer />
      </div>
    </>
  );
}


