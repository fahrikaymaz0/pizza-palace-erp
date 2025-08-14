'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: number;
  delivery_address: string;
  phone: string;
  notes: string;
  created_at: string;
  user_name: string;
  user_email: string;
  items: any[];
}

export default function AdminOrdersDebugPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Admin siparişleri debug yükleniyor...');

      const response = await fetch('/api/pizza-admin/orders', {
        credentials: 'include',
      });
      console.log('📡 API Response Status:', response.status);

      if (response.status === 401) {
        console.log('❌ Yetkisiz erişim');
        setError('Yetkisiz erişim - Pizza admin token gerekli');
        return;
      }

      if (!response.ok) {
        throw new Error('Siparişler yüklenemedi');
      }

      const data = await response.json();
      console.log('📦 API Response Data:', data);

      const allOrders = data.orders || [];
      console.log('📋 Toplam sipariş sayısı:', allOrders.length);
      console.log(
        '📋 Siparişler:',
        allOrders.map((o: any) => ({
          id: o.id,
          status: o.status,
          user: o.user_name,
        }))
      );

      setOrders(allOrders);
    } catch (error) {
      console.error('Orders load error:', error);
      setError('Siparişler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusText = (status: number) => {
    switch (status) {
      case -1:
        return '❌ İptal Edildi';
      case 0:
        return '⏳ Onay Bekliyor';
      case 1:
        return '✅ Onaylandı';
      case 2:
        return '🚚 Kuryede';
      case 3:
        return '🎉 Tamamlandı';
      default:
        return '⏳ Onay Bekliyor';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case -1:
        return 'bg-red-500 text-white';
      case 0:
        return 'bg-yellow-500 text-white';
      case 1:
        return 'bg-green-500 text-white';
      case 2:
        return 'bg-purple-500 text-white';
      case 3:
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔍 Admin Siparişleri Debug
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">Onay Bekleyen (0)</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 0).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Onaylanan (1)</h3>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 1).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Kuryede (2)</h3>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 2).length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Tamamlanan (3)</h3>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 3).length}
              </p>
            </div>
          </div>

          <button
            onClick={loadOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Yenile
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Tüm Siparişler ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Henüz sipariş yok
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Yeni siparişler geldiğinde burada görünecek.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map(order => (
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
                        {new Date(order.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)} (Status: {order.status})
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₺{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Sipariş Detayları:
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-1"
                        >
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Teslimat Adresi:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.delivery_address}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Telefon:
                      </h4>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Notlar:
                      </h4>
                      <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
