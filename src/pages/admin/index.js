import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // API URL - Production'da localhost'a yönlendir
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api' 
    : '/api';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading dashboard data from localhost backend...');
      
      // Load orders
      const ordersResponse = await fetch(`${API_BASE}/admin/orders`);
      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        if (ordersResult.success) {
          setOrders(ordersResult.data);
          console.log('✅ Orders loaded:', ordersResult.data.length);
          
          // Calculate stats
          const totalOrders = ordersResult.data.length;
          const totalRevenue = ordersResult.data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
          const pendingOrders = ordersResult.data.filter(order => order.status === 0).length;
          
          setStats({
            totalOrders,
            totalRevenue,
            pendingOrders
          });
        }
      }
      
      // Simulated user data
      setUser({
        name: 'Kaymaz Admin',
        email: 'admin@123',
        role: 'admin'
      });
      
    } catch (error) {
      console.error('❌ Load dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Pizza Palace ERP</title>
        <meta name="description" content="Admin dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">👨‍💼 Admin Dashboard</h1>
            <p className="text-white text-lg">Hoş geldiniz, {user?.name}!</p>
            <p className="text-white text-sm mt-2">Backend: {API_BASE}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">📋 Toplam Sipariş</h3>
              <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">💰 Toplam Gelir</h3>
              <p className="text-3xl font-bold text-white">₺{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">⏳ Bekleyen Sipariş</h3>
              <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white bg-opacity-20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Son Siparişler</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">Sipariş #{order.id}</p>
                        <p className="text-white text-sm">{order.user_name || 'Anonim'}</p>
                        <p className="text-white text-sm">{order.delivery_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">₺{order.total_amount}</p>
                        <p className="text-white text-sm">
                          {order.status === 0 ? '⏳ Bekliyor' : '✅ Tamamlandı'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">Henüz sipariş yok.</p>
            )}
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/orders" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">📋 Siparişler</h3>
                <p className="text-white">Sipariş yönetimi</p>
              </div>
            </Link>

            <Link href="/admin/products" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">🍕 Ürünler</h3>
                <p className="text-white">Ürün yönetimi</p>
              </div>
            </Link>

            <Link href="/admin/users" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">👥 Kullanıcılar</h3>
                <p className="text-white">Kullanıcı yönetimi</p>
              </div>
            </Link>

            <Link href="/admin/reports" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">📊 Raporlar</h3>
                <p className="text-white">Satış raporları</p>
              </div>
            </Link>

            <Link href="/admin/settings" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">⚙️ Ayarlar</h3>
                <p className="text-white">Sistem ayarları</p>
              </div>
            </Link>

            <Link href="/" className="block">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-2">🏠 Ana Sayfa</h3>
                <p className="text-white">Ana sayfaya dön</p>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => window.history.back()}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              ← Geri Dön
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 