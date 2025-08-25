import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Siparişleri görmek için giriş yapmalısınız.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Siparişler alınamadı');
      }
    } catch (e) {
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>Siparişlerim - Pizza Krallığı</title>
      </Head>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-red-600">Siparişlerim</h1>
            <Link href="/menu" className="text-yellow-600 hover:text-yellow-700">Menüye Dön</Link>
          </div>

          {loading && <p>Yükleniyor...</p>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-yellow-300 shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">#{order.id.slice(0,6).toUpperCase()}</h3>
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Durum: <span className="font-semibold text-yellow-700">{order.status}</span></p>
                  <p className="text-sm text-gray-600">Ödeme: <span className="font-semibold text-yellow-700">{order.paymentStatus}</span></p>
                </div>
                <ul className="divide-y">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between">
                      <span className="text-gray-800">{it.name} × {it.quantity}</span>
                      <span className="font-semibold text-red-600">₺{it.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-700">Toplam</span>
                  <span className="text-2xl font-bold text-red-600">₺{order.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-gray-600">Henüz siparişiniz yok.</div>
          )}
        </div>
      </div>
    </>
  );
}
