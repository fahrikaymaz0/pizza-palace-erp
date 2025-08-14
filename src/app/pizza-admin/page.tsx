'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: number; // -1: İptal, 0: Onay Bekliyor, 1: Onaylandı, 2: Kuryede
  delivery_address: string;
  phone: string;
  notes: string;
  created_at: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export default function PizzaAdminPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'delivery' | 'completed' | 'cancelled'>('pending');
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
  const [showCancelledNotification, setShowCancelledNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await loadOrders();
      } catch (e) {
        router.replace("/pizza-admin/login");
      }
    };
    init();
  }, []);

  // Siparişleri her 30 saniyede bir otomatik yenile
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Pizza admin - Siparişler yenileniyor...');
      loadOrders();
      setLastUpdate(new Date());
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, []);



  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Admin siparişleri yükleniyor...');
      
      const response = await fetch('/api/pizza-admin/orders', { credentials: 'include' });
      console.log('📡 API Response Status:', response.status);
      
      if (response.status === 401) {
        console.log('❌ Yetkisiz erişim - Login sayfasına yönlendiriliyor');
        router.replace('/pizza-admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Siparişler yüklenemedi');
      }
      
      const data = await response.json();
      console.log('📦 API Response Data:', data);
      
      const allOrders = data.orders || [];
      console.log('📋 Toplam sipariş sayısı:', allOrders.length);
      console.log('📋 Siparişler:', allOrders.map((o: any) => ({ id: o.id, status: o.status, user: o.user_name })));
      
      setOrders(allOrders);
      
      // Sadece onay bekleyen siparişleri (status: 0) filtrele
      const pending = allOrders.filter((order: any) => order.status === 0);
      console.log('⏳ Onay bekleyen sipariş sayısı:', pending.length);
      console.log('⏳ Onay bekleyen siparişler:', pending.map((o: any) => ({ id: o.id, status: o.status, user: o.user_name })));
      
      setPendingOrders(pending);
      
      // İptal edilen siparişleri filtrele
      const cancelled = allOrders.filter((order: any) => order.status === -1);
      setCancelledOrders(cancelled);
      
      // Eğer onay bekleyen sekmedeyse ve seçili sipariş yoksa veya seçili sipariş artık onay beklemeyen durumdaysa
      if (activeTab === 'pending') {
        if (pending.length > 0) {
          // Seçili sipariş hala onay bekliyor mu kontrol et
          const currentSelectedStillPending = selectedOrder && pending.find((order: any) => order.id === selectedOrder.id);
          if (!currentSelectedStillPending) {
            setSelectedOrder(pending[0]);
          }
        } else {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error('Orders load error:', error);
      setError('Siparişler yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: number) => {
    try {
      const response = await fetch(`/api/pizza-admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Sipariş güncellenemedi');
      }

      // Siparişleri yeniden yükle
      await loadOrders();
      
      // Eğer onay bekleyen sekmedeyse ve sipariş artık onay beklemeyen duruma geçtiyse
      // seçili siparişi temizle ve ilk onay bekleyen siparişi seç
      if (activeTab === 'pending' && newStatus !== 0) {
        const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
        if (updatedPendingOrders.length > 0) {
          setSelectedOrder(updatedPendingOrders[0]);
        } else {
          setSelectedOrder(null);
        }
      }
      
      // Sipariş durumu değiştiğinde kullanıcı tarafında da güncellenecek
      console.log(`✅ Sipariş #${orderId} durumu ${newStatus} olarak güncellendi`);
      
      // Başarı mesajı göster
      console.log(`✅ Sipariş #${orderId} durumu güncellendi: ${newStatus}`);
    } catch (error) {
      console.error('Order update error:', error);
      setError('Sipariş güncellenirken hata oluştu');
    }
  };

  const approveOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 1);
  };

  const rejectOrder = async (order: Order) => {
    await updateOrderStatus(order.id, -1);
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case -1: return 'bg-red-500 text-white border-red-600';
      case 0: return 'bg-yellow-500 text-white border-yellow-600';
      case 1: return 'bg-green-500 text-white border-green-600';
      case 2: return 'bg-purple-500 text-white border-purple-600';
      case 3: return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case -1: return '❌ İptal Edildi';
      case 0: return '⏳ Onay Bekliyor';
      case 1: return '✅ Onaylandı';
      case 2: return '🚚 Kuryede';
      case 3: return '🎉 Tamamlandı';
      default: return '⏳ Onay Bekliyor';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/pizza/login');
    } catch (error) {
      console.error('Logout error:', error);
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

  // Telefon numarası bileşeni
  const PhoneDisplay = ({ phone }: { phone: string }) => {
    const formattedPhone = formatPhoneForDisplay(phone);
    const isClickable = phone && phone.replace(/\D/g, '').length >= 10;
    
    return (
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {isClickable ? (
          <a 
            href={`tel:${formattedPhone}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            title="Aramak için tıklayın"
          >
            {formattedPhone}
          </a>
        ) : (
          <span className="text-gray-600">{formattedPhone}</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">🍕</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pizza Palace Admin</h1>
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Sipariş Yönetimi
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* İptal Edilen Siparişler Bildirimi */}
              {cancelledOrders.length > 0 && (
                <div className="relative">
                  <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2 text-sm text-red-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium">
                      {cancelledOrders.length} sipariş iptal edildi
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  loadOrders();
                  setLastUpdate(new Date());
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                title="Siparişleri yenile"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Yenile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Onay Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders ? orders.filter(o => o.status === 0).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders ? orders.filter(o => o.status === 1).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kuryede</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders ? orders.filter(o => o.status === 2).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders ? orders.filter(o => o.status === 3).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">İptal Edilen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders ? orders.filter(o => o.status === -1).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Son Güncelleme Bilgisi */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  // Onay bekleyen sekmesine geçerken ilk onay bekleyen siparişi seç
                  if (pendingOrders.length > 0) {
                    setSelectedOrder(pendingOrders[0]);
                  } else {
                    setSelectedOrder(null);
                  }
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Onay Bekleyen ({orders ? orders.filter(o => o.status === 0).length : 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('approved');
                  setSelectedOrder(null);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Onaylanan ({orders ? orders.filter(o => o.status === 1).length : 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('delivery');
                  setSelectedOrder(null);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'delivery'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Kuryede ({orders ? orders.filter(o => o.status === 2).length : 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('completed');
                  setSelectedOrder(null);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tamamlanan ({orders ? orders.filter(o => o.status === 3).length : 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('cancelled');
                  setSelectedOrder(null);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                İptal Edilen ({orders ? orders.filter(o => o.status === -1).length : 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Onay Bekleyen Siparişler Listesi */}
        {activeTab === 'pending' && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Onay Bekleyen Siparişler ({pendingOrders.length})
            </h2>
            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Onay bekleyen sipariş yok</h3>
                <p className="mt-1 text-sm text-gray-500">Tüm siparişler onaylandı.</p>
              </div>
            ) : (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {pendingOrders.map((order, index) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`flex-shrink-0 rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 ${
                      selectedOrder?.id === order.id
                        ? 'ring-2 ring-red-500'
                        : 'hover:shadow-lg'
                    } ${
                      order.status === 0 ? 'bg-yellow-50 border-2 border-yellow-200' :
                      order.status === 1 ? 'bg-green-50 border-2 border-green-200' :
                      order.status === 2 ? 'bg-purple-50 border-2 border-purple-200' :
                      order.status === 3 ? 'bg-blue-50 border-2 border-blue-200' :
                      order.status === -1 ? 'bg-red-50 border-2 border-red-200' :
                      'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        order.status === 0 ? 'bg-yellow-100' :
                        order.status === 1 ? 'bg-green-100' :
                        order.status === 2 ? 'bg-purple-100' :
                        order.status === 3 ? 'bg-blue-100' :
                        order.status === -1 ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <span className={`font-bold text-lg ${
                          order.status === 0 ? 'text-yellow-600' :
                          order.status === 1 ? 'text-green-600' :
                          order.status === 2 ? 'text-purple-600' :
                          order.status === 3 ? 'text-blue-600' :
                          order.status === -1 ? 'text-red-600' :
                          'text-gray-600'
                        }`}>{index + 1}</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Sipariş #{order.id}</h3>
                      <p className="text-xs text-gray-600 mt-1">{order.user_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                              <p className={`text-sm font-bold mt-2 ${
                          order.status === 0 ? 'text-yellow-600' :
                          order.status === 1 ? 'text-green-600' :
                          order.status === 2 ? 'text-purple-600' :
                          order.status === 3 ? 'text-blue-600' :
                          order.status === -1 ? 'text-red-600' :
                          'text-red-600'
                        }`}>₺{order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seçili Sipariş Detayı */}
        {activeTab === 'pending' && selectedOrder && selectedOrder.status === 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className={`px-6 py-4 border-b border-gray-200 ${
              selectedOrder.status === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
              selectedOrder.status === 1 ? 'bg-gradient-to-r from-green-50 to-emerald-50' :
              selectedOrder.status === 2 ? 'bg-gradient-to-r from-purple-50 to-indigo-50' :
              selectedOrder.status === 3 ? 'bg-gradient-to-r from-blue-50 to-cyan-50' :
              selectedOrder.status === -1 ? 'bg-gradient-to-r from-red-50 to-pink-50' :
              'bg-gradient-to-r from-gray-50 to-slate-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sipariş #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.user_name} ({selectedOrder.user_email})
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₺{selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Sipariş Detayları:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm text-gray-700">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ₺{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Teslimat Bilgileri:</h4>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Adres:</span> {selectedOrder.delivery_address}
                  </p>
                  <div>
                    <span className="font-medium">Telefon:</span> <PhoneDisplay phone={selectedOrder.phone} />
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Müşteri Notu:</h4>
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => approveOrder(selectedOrder)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Onayla
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 2)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Kuryede
                </button>
                <button
                  onClick={() => rejectOrder(selectedOrder)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  İptal Et
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'pending' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {selectedOrder && selectedOrder.status !== 0 ? 'Seçili sipariş artık onay beklemeyen durumda' : 'Sipariş seçilmedi'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedOrder && selectedOrder.status !== 0 ? 'Lütfen başka bir onay bekleyen sipariş seçin.' : 'Onay bekleyen bir sipariş seçin.'}
            </p>
          </div>
        )}

        {/* Onaylanan Siparişler Listesi */}
        {activeTab === 'approved' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-lg font-medium text-gray-900">Onaylanan Siparişler</h2>
              <p className="text-sm text-gray-600">
                {orders ? orders.filter(o => o.status === 1).length : 0} sipariş onaylandı
              </p>
            </div>

            {!orders || orders.filter(o => o.status === 1).length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Onaylanan sipariş yok</h3>
                <p className="mt-1 text-sm text-gray-500">Onaylanan siparişler burada görünecek.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders && orders.filter(o => o.status === 1).map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sipariş #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.user_name} ({order.user_email})
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₺{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-700">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₺{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Teslimat Adresi:</h4>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Telefon:</h4>
                        <PhoneDisplay phone={order.phone} />
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notlar:</h4>
                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => updateOrderStatus(order.id, 2)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Kuryede
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tamamla
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, -1)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        İptal Et
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Kuryede Siparişler Listesi */}
        {activeTab === 'delivery' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h2 className="text-lg font-medium text-gray-900">Kuryede Siparişler</h2>
              <p className="text-sm text-gray-600">
                {orders ? orders.filter(o => o.status === 2).length : 0} sipariş kuryede
              </p>
            </div>

            {!orders || orders.filter(o => o.status === 2).length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Kuryede sipariş yok</h3>
                <p className="mt-1 text-sm text-gray-500">Kuryede olan siparişler burada görünecek.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders && orders.filter(o => o.status === 2).map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sipariş #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.user_name} ({order.user_email})
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₺{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-700">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₺{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Teslimat Adresi:</h4>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Telefon:</h4>
                        <PhoneDisplay phone={order.phone} />
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notlar:</h4>
                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => updateOrderStatus(order.id, 3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tamamla
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, -1)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        İptal Et
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tamamlanan Siparişler Listesi */}
        {activeTab === 'completed' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h2 className="text-lg font-medium text-gray-900">Tamamlanan Siparişler</h2>
              <p className="text-sm text-gray-600">
                {orders ? orders.filter(o => o.status === 3).length : 0} sipariş tamamlandı
              </p>
            </div>

            {!orders || orders.filter(o => o.status === 3).length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tamamlanan sipariş yok</h3>
                <p className="mt-1 text-sm text-gray-500">Tamamlanan siparişler burada görünecek.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders && orders.filter(o => o.status === 3).map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sipariş #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.user_name} ({order.user_email})
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₺{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-700">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₺{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Teslimat Adresi:</h4>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Telefon:</h4>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notlar:</h4>
                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Tamamlanan siparişler için buton yok */}
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800 font-medium">Sipariş başarıyla tamamlandı!</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* İptal Edilen Siparişler Listesi */}
        {activeTab === 'cancelled' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
              <h2 className="text-lg font-medium text-gray-900">İptal Edilen Siparişler</h2>
              <p className="text-sm text-gray-600">
                {orders ? orders.filter(o => o.status === -1).length : 0} sipariş iptal edildi
              </p>
            </div>

            {!orders || orders.filter(o => o.status === -1).length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">İptal edilen sipariş yok</h3>
                <p className="mt-1 text-sm text-gray-500">İptal edilen siparişler burada görünecek.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders && orders.filter(o => o.status === -1).map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sipariş #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.user_name} ({order.user_email})
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₺{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sipariş Detayları:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-700">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₺{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Teslimat Adresi:</h4>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Telefon:</h4>
                        <PhoneDisplay phone={order.phone} />
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notlar:</h4>
                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* İptal Edilen Siparişler İçin Bilgi Mesajı */}
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm text-red-800 font-medium">
                          Bu sipariş iptal edildi
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
