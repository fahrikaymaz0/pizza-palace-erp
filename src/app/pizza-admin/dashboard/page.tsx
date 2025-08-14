'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  address: string;
  phone: string;
  notes: string;
  itemCount: number;
  createdAt: string;
  items: Array<{
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export default function PizzaAdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadOrders();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/pizza/admin/orders', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        router.push('/pizza-admin/login');
      }
    } catch (error) {
      router.push('/pizza-admin/login');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/pizza/admin/orders', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } else {
        setError('Siparişler yüklenemedi');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/pizza/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Siparişleri yeniden yükle
        await loadOrders();
      } else {
        setError('Durum güncellenemedi');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/pizza/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/pizza-admin/login');
    } catch (error) {
      router.push('/pizza-admin/login');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivering': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Onay Bekliyor';
      case 'approved': return 'Onaylandı / Hazırlanıyor';
      case 'delivering': return 'Kuryede';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-4xl mr-3">🍕</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pizza Admin Panel</h1>
                <p className="text-sm text-gray-600">Sipariş Yönetimi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Pizza Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hazırlanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kuryede</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivering').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teslim Edilen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'
              }`}
            >
              Tümü ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200'
              }`}
            >
              Bekleyen ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              Hazırlanan ({orders.filter(o => o.status === 'approved').length})
            </button>
            <button
              onClick={() => setSelectedStatus('delivering')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'delivering'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              Kuryede ({orders.filter(o => o.status === 'delivering').length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz sipariş yok</h3>
              <p className="text-gray-600">Bekleyen siparişler burada görünecek</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sipariş #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {order.customerName} - {order.customerEmail}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 lg:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Sipariş Detayları</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-sm">🍕</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.name} x{item.quantity}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Teslimat Bilgileri</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Adres:</strong> {order.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Telefon:</strong> <PhoneDisplay phone={order.phone} />
                    </p>
                    {order.notes && (
                      <p className="text-sm text-gray-600">
                        <strong>Notlar:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Durum Güncelle</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'approved')}
                      disabled={order.status === 'approved'}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivering')}
                      disabled={order.status === 'delivering'}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
                    >
                      Kuryeye Ver
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={order.status === 'delivered'}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
                    >
                      Teslim Edildi
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status === 'cancelled'}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
                    >
                      İptal Et
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}




