'use client';

import { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { MapPin, Phone, Clock, Star, Navigation as NavigationIcon, Car, Motorcycle, Wifi, CreditCard } from 'lucide-react';

const stores = [
  {
    id: 1,
    name: "Pizza Krallığı - Kadıköy",
    address: "Caferağa Mah. Moda Cad. No:123, Kadıköy/İstanbul",
    phone: "0216 555 0123",
    rating: 4.8,
    reviews: 342,
    distance: "0.8 km",
    coordinates: { lat: 40.9909, lng: 29.0303 },
    hours: "10:00 - 23:00",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı", "Parking"],
    isOpen: true,
    deliveryTime: "25-35 dk",
    minOrder: "₺50",
    image: "/images/stores/kadikoy.jpg"
  },
  {
    id: 2,
    name: "Pizza Krallığı - Beşiktaş",
    address: "Sinanpaşa Mah. Beşiktaş Cad. No:456, Beşiktaş/İstanbul",
    phone: "0212 555 0456",
    rating: 4.7,
    reviews: 289,
    distance: "2.1 km",
    coordinates: { lat: 41.0422, lng: 29.0083 },
    hours: "10:00 - 23:30",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı"],
    isOpen: true,
    deliveryTime: "30-40 dk",
    minOrder: "₺60",
    image: "/images/stores/besiktas.jpg"
  },
  {
    id: 3,
    name: "Pizza Krallığı - Şişli",
    address: "Teşvikiye Mah. Rumeli Cad. No:789, Şişli/İstanbul",
    phone: "0212 555 0789",
    rating: 4.9,
    reviews: 156,
    distance: "3.5 km",
    coordinates: { lat: 41.0602, lng: 28.9877 },
    hours: "10:00 - 22:30",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı", "Parking"],
    isOpen: false,
    deliveryTime: "35-45 dk",
    minOrder: "₺70",
    image: "/images/stores/sisli.jpg"
  },
  {
    id: 4,
    name: "Pizza Krallığı - Bakırköy",
    address: "Zuhuratbaba Mah. İstanbul Cad. No:321, Bakırköy/İstanbul",
    phone: "0212 555 0321",
    rating: 4.6,
    reviews: 198,
    distance: "5.2 km",
    coordinates: { lat: 40.9819, lng: 28.8772 },
    hours: "10:00 - 23:00",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı"],
    isOpen: true,
    deliveryTime: "40-50 dk",
    minOrder: "₺55",
    image: "/images/stores/bakirkoy.jpg"
  },
  {
    id: 5,
    name: "Pizza Krallığı - Üsküdar",
    address: "Mimar Sinan Mah. Selmani Pak Cad. No:654, Üsküdar/İstanbul",
    phone: "0216 555 0654",
    rating: 4.5,
    reviews: 234,
    distance: "4.8 km",
    coordinates: { lat: 41.0235, lng: 29.0122 },
    hours: "10:00 - 22:00",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı", "Parking"],
    isOpen: true,
    deliveryTime: "35-45 dk",
    minOrder: "₺65",
    image: "/images/stores/uskudar.jpg"
  },
  {
    id: 6,
    name: "Pizza Krallığı - Maltepe",
    address: "Feyzullah Mah. Bağdat Cad. No:987, Maltepe/İstanbul",
    phone: "0216 555 0987",
    rating: 4.4,
    reviews: 167,
    distance: "8.3 km",
    coordinates: { lat: 40.9352, lng: 29.1551 },
    hours: "10:00 - 23:00",
    features: ["Teslimat", "Paket Servis", "WiFi", "Kredi Kartı"],
    isOpen: true,
    deliveryTime: "45-55 dk",
    minOrder: "₺75",
    image: "/images/stores/maltepe.jpg"
  }
];

const filters = [
  { id: 'all', name: 'Tümü', icon: '🏪' },
  { id: 'open', name: 'Açık', icon: '🟢' },
  { id: 'delivery', name: 'Teslimat', icon: '🚚' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'wifi', name: 'WiFi', icon: '📶' }
];

export default function Stores() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = stores.filter(store => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'open' && store.isOpen) ||
      (selectedFilter === 'delivery' && store.features.includes('Teslimat')) ||
      (selectedFilter === 'parking' && store.features.includes('Parking')) ||
      (selectedFilter === 'wifi' && store.features.includes('WiFi'));
    
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const callStore = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <>
      <Head>
        <title>Şubeler - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı şubeleri. En yakın şubemizi bulun ve sipariş verin!" />
        <meta name="keywords" content="pizza şubeleri, pizza krallığı şubeleri, teslimat, paket servis" />
        <meta property="og:title" content="Şubeler - Pizza Krallığı" />
        <meta property="og:description" content="Pizza Krallığı şubeleri. En yakın şubemizi bulun ve sipariş verin!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Şubeler - Pizza Krallığı" />
        <meta name="twitter:description" content="Pizza Krallığı şubeleri. En yakın şubemizi bulun ve sipariş verin!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                🏪 Şubelerimiz
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                En yakın şubemizi bulun ve lezzetli pizzalarımızı deneyin
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Şube ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-white/70" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">{stores.length}</div>
                  <div className="text-sm opacity-90">Toplam Şube</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">{stores.filter(s => s.isOpen).length}</div>
                  <div className="text-sm opacity-90">Açık Şube</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">25-55</div>
                  <div className="text-sm opacity-90">Dakika Teslimat</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Online Sipariş</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === filter.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <span>{filter.icon}</span>
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  selectedStore?.id === store.id ? 'ring-4 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedStore(store)}
              >
                {/* Store Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      store.isOpen 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-white' : 'bg-white'}`}></div>
                      {store.isOpen ? 'AÇIK' : 'KAPALI'}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-600">{store.rating}</div>
                        <div className="text-xs text-gray-600">★</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Car className="w-4 h-4" />
                          {store.deliveryTime}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {store.distance}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {store.address}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{store.rating}</span>
                      <span className="text-gray-500">({store.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {store.hours}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {store.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Teslimat Süresi</div>
                        <div className="font-semibold">{store.deliveryTime}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Min. Sipariş</div>
                        <div className="font-semibold">{store.minOrder}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        callStore(store.phone);
                      }}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Ara
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(store);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <NavigationIcon className="w-4 h-4" />
                      Yol Tarifi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Şube bulunamadı
              </h3>
              <p className="text-gray-500">
                Arama kriterlerinize uygun şube bulunamadı.
              </p>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🗺️ Harita Görünümü
            </h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-gray-600 mb-4">
                  İnteraktif harita burada görüntülenecek
                </p>
                <p className="text-sm text-gray-500">
                  Google Maps entegrasyonu ile şube konumları
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}


