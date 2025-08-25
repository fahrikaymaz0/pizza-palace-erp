'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Crown, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  LogOut,
  Eye,
  Package,
  DollarSign,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0,
    paid: 0,
    unpaid: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    // Simple auth check and data fetch
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    // Fetch orders directly
    fetchOrders();
    return () => { isMountedRef.current = false; };
  }, []); // Only run once on mount

  // Separate effect for pagination
  useEffect(() => {
    if (currentPage > 1) {
      fetchOrders();
    }
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const currentFetchId = ++fetchIdRef.current;
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/admin/login');
        return;
      }
      
      console.log('Fetching orders...');
      
      const response = await fetch(`/api/orders/all?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      console.log('Orders API status:', response.status);
      
      if (response.status === 401 || response.status === 403) {
        // Token is invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      console.log('Orders data:', data);

      // Ignore stale responses
      if (!isMountedRef.current || currentFetchId !== fetchIdRef.current) {
        return;
      }

      if (data.success) {
        setOrders(data.orders || []);
        setStatistics(data.statistics || {
          total: 0,
          pending: 0,
          preparing: 0,
          completed: 0,
          cancelled: 0,
          paid: 0,
          unpaid: 0
        });
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setHasFetched(true);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !hasFetched) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı Admin Paneli" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kaymaz-icon.ico" />
      </Head>

      <div className="min-h-screen bg-[conic-gradient(at_30%_20%,#fff, #fff, #fff)] text-gray-900">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900">Pizza Krallığı Admin</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow p-6 border border-red-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6 border border-yellow-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.pending}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6 border border-green-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ödenen</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.paid}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6 border border-blue-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hazırlanan</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.preparing}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 via-white to-yellow-50">
              <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
            </div>
            
            <div className="overflow-x-auto">
              {orders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Ürünler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Toplam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Ödeme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Tarih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-yellow-50/60">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerEmail}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerPhone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-gray-500">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.totalPrice}₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' && 'Bekliyor'}
                            {order.status === 'preparing' && 'Hazırlanıyor'}
                            {order.status === 'completed' && 'Tamamlandı'}
                            {order.status === 'cancelled' && 'İptal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus === 'completed' && 'Ödendi'}
                            {order.paymentStatus === 'pending' && 'Bekliyor'}
                            {order.paymentStatus === 'failed' && 'Başarısız'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <ShoppingCart className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Sipariş Yok</h3>
                  <p className="text-gray-500">Müşteriler sipariş vermeye başladığında burada görünecek.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Sayfa {currentPage} / {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
