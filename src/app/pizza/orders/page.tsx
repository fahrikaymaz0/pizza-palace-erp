'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: number; // -1: İptal, 0: Onay Bekliyor, 1: Onaylandı, 2: Kuryede, 3: Tamamlandı
  createdAt: string;
  address?: string;
  phone?: string;
  notes?: string;
  payment?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
  transaction?: {
    transactionId: string;
    authCode: string;
    bank: string;
    paymentMethod: string;
  };
}

export default function PizzaOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showNewOrderNotification, setShowNewOrderNotification] =
    useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    deliveryAddress: '',
    phone: '',
    notes: '',
  });
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    checkUserStatus();

    // URL'den yeni sipariş parametresini kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const newOrder = urlParams.get('newOrder');
    if (newOrder === 'true') {
      setShowNewOrderNotification(true);
      // URL'den parametreyi temizle
      window.history.replaceState({}, document.title, window.location.pathname);

      // 5 saniye sonra bildirimi gizle
      setTimeout(() => {
        setShowNewOrderNotification(false);
      }, 5000);
    }
  }, []);

  // Sipariş durumunu her 30 saniyede bir güncelle
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('🔄 Sipariş durumu kontrol ediliyor...');
      loadOrders();
      setLastUpdate(new Date());
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, [user]);

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        loadOrders();
      } else {
        // Kullanıcı giriş yapmamış, login sayfasına yönlendir
        window.location.href = '/pizza/login';
      }
    } catch (error) {
      console.error('Kullanıcı kontrolü hatası:', error);
      window.location.href = '/pizza/login';
    }
  };

  const loadOrders = async () => {
    try {
      console.log('🔄 Siparişler yükleniyor...');
      const response = await fetch('/api/pizza/orders', {
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📦 API Response:', data);
      console.log('📦 Response success:', data.success);
      console.log('📦 Response data:', data.data);
      console.log('📦 Response orders:', data.data?.orders);
      console.log('📦 Response orders length:', data.data?.orders?.length);

      if (data.success) {
        if (data.data?.orders) {
          setOrders(data.data.orders);
        } else {
          setOrders([]);
        }
      } else {
        console.error('❌ API başarısız:', data);
        setOrders(null);
      }
    } catch (error) {
      console.error('❌ Sipariş yükleme hatası:', error);
      setOrders(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/pizza/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/pizza';
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case -1:
        return 'bg-red-500 text-white border-red-600';
      case 0:
        return 'bg-yellow-500 text-white border-yellow-600';
      case 1:
        return 'bg-green-500 text-white border-green-600';
      case 2:
        return 'bg-purple-500 text-white border-purple-600';
      case 3:
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case -1:
        return '❌ Sipariş İptal Edildi';
      case 0:
        return '⏳ Onay Bekliyor';
      case 1:
        return '✅ Onaylandı';
      case 2:
        return '🚚 Kuryede';
      case 3:
        return '🎉 Teslim Edildi';
      default:
        return '⏳ Onay Bekliyor';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case -1:
        return (
          <svg
            className="w-5 h-5"
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
        );
      case 0:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 1:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 2:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case 3:
        return (
          <svg
            className="w-5 h-5"
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
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handlePaymentSubmit = async () => {
    // Bu fonksiyon artık kullanılmıyor, cart sayfasında ödeme yapılıyor
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pizza/orders/${orderId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        alert(`Sipariş #${orderId} başarıyla iptal edildi.`);
        loadOrders(); // Siparişleri yenile
      } else {
        const data = await response.json();
        alert(`Sipariş iptal edilemedi: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Sipariş iptal hatası:', error);
      alert('Sipariş iptal edilirken bir hata oluştu.');
    }
  };

  // Telefon numarası formatı
  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return '';

    // Sadece rakamları al
    const numbers = phone.replace(/\D/g, '');

    // Türkiye telefon numarası formatı
    if (numbers.length === 10) {
      return `+90 ${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8)}`;
    } else if (numbers.length === 11 && numbers.startsWith('0')) {
      return `+90 ${numbers.slice(1, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9)}`;
    } else if (numbers.length === 11 && numbers.startsWith('90')) {
      return `+90 ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10)}`;
    }

    return phone; // Formatlanamazsa orijinal değeri döndür
  };

  if (loading || orders === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Siparişleriniz Yükleniyor
          </h2>
          <p className="text-gray-600 text-lg mb-4">Lütfen bekleyin...</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Sipariş bilgileri getiriliyor
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-2xl">🍕</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pizza Palace
                </h1>
                <p className="text-gray-600">
                  Siparişlerinizi buradan takip edebilirsiniz
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  loadOrders();
                  setLastUpdate(new Date());
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg transform hover:scale-105"
                title="Sipariş durumunu yenile"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Yenile
                </div>
              </button>

              <Link
                href="/pizza/menu"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Menüye Git
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Çıkış Yap
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Yeni Sipariş Bildirimi */}
        {showNewOrderNotification && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  🎉 Yeni Siparişiniz Başarıyla Oluşturuldu!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Siparişiniz restoran tarafından onaylanmayı bekliyor.
                    Durumunu aşağıdan takip edebilirsiniz.
                  </p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowNewOrderNotification(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Son Güncelleme Bilgisi */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-blue-800">
                Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
              </span>
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
              Otomatik güncelleme aktif (30s)
            </div>
          </div>
        </div>
        {orders && Array.isArray(orders) && orders.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Henüz Siparişiniz Yok
            </h2>
            <p className="text-gray-600 mb-8">
              İlk siparişinizi vermek için menüye göz atın!
            </p>
            <Link
              href="/pizza/menu"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Menüye Git
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders &&
              orders.map(order => (
                <div
                  key={order.id}
                  className={`rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 ${
                    order.status === 0
                      ? 'bg-yellow-50 border-yellow-200'
                      : order.status === 1
                        ? 'bg-green-50 border-green-200'
                        : order.status === 2
                          ? 'bg-purple-50 border-purple-200'
                          : order.status === 3
                            ? 'bg-blue-50 border-blue-200'
                            : order.status === -1
                              ? 'bg-red-50 border-red-200'
                              : 'bg-white border-gray-100'
                  }`}
                >
                  {/* Order Header */}
                  <div
                    className={`p-6 border-b border-gray-100 ${
                      order.status === 0
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                        : order.status === 1
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                          : order.status === 2
                            ? 'bg-gradient-to-r from-purple-50 to-indigo-50'
                            : order.status === 3
                              ? 'bg-gradient-to-r from-blue-50 to-cyan-50'
                              : order.status === -1
                                ? 'bg-gradient-to-r from-red-50 to-pink-50'
                                : 'bg-gradient-to-r from-gray-50 to-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            order.status === 0
                              ? 'bg-yellow-100'
                              : order.status === 1
                                ? 'bg-green-100'
                                : order.status === 2
                                  ? 'bg-purple-100'
                                  : order.status === 3
                                    ? 'bg-blue-100'
                                    : order.status === -1
                                      ? 'bg-red-100'
                                      : 'bg-red-100'
                          }`}
                        >
                          <svg
                            className={`w-6 h-6 ${
                              order.status === 0
                                ? 'text-yellow-600'
                                : order.status === 1
                                  ? 'text-green-600'
                                  : order.status === 2
                                    ? 'text-purple-600'
                                    : order.status === 3
                                      ? 'text-blue-600'
                                      : order.status === -1
                                        ? 'text-red-600'
                                        : 'text-red-600'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Sipariş #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="font-semibold">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid gap-4 mb-6">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover rounded-lg shadow-sm"
                            />
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Adet: {item.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Delivery Info */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Teslimat Bilgileri
                        </h4>
                        <div className="space-y-2 text-sm">
                          {order.address && (
                            <p className="text-gray-700">
                              <span className="font-medium">Adres:</span>{' '}
                              {order.address}
                            </p>
                          )}
                          {order.phone && (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span className="font-medium">Telefon:</span>
                              <span className="text-gray-600">
                                {formatPhoneForDisplay(order.phone)}
                              </span>
                            </div>
                          )}
                          {order.notes && (
                            <p className="text-gray-700">
                              <span className="font-medium">Notlar:</span>{' '}
                              {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          Ödeme Bilgileri
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Ödeme:</span> Kredi
                            Kartı ile Ödendi
                          </p>
                          {order.payment && (
                            <>
                              <p className="text-gray-700">
                                <span className="font-medium">Kart:</span> ••••
                                •••• •••• {order.payment.cardNumber.slice(-4)}
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">
                                  Kart Sahibi:
                                </span>{' '}
                                {order.payment.cardHolder}
                              </p>
                            </>
                          )}
                          {order.transaction && (
                            <>
                              <p className="text-gray-700">
                                <span className="font-medium">İşlem No:</span>{' '}
                                {order.transaction.transactionId}
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Banka:</span>{' '}
                                {order.transaction.bank}
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Yetki Kodu:</span>{' '}
                                {order.transaction.authCode}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Toplam Tutar
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Cancel Button - Only for pending orders */}
                    {order.status === 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCancelOrder(Number(order.id))}
                          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
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
                          Siparişi İptal Et
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
