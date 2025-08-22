'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Star,
  TrendingUp,
  Shield,
  Crown
} from 'lucide-react';
import { useTheme } from '../../context/DarkModeContext';

export default function AdminDashboard() {
  const { isLightMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMessages: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Siparişleri getir
      const ordersResponse = await fetch('/api/orders/all');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);

      // Mesajları getir
      const messagesResponse = await fetch('/api/messages/all');
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.messages || []);

      // Kullanıcıları getir
      const usersResponse = await fetch('/api/users/all');
      const usersData = await usersResponse.json();
      setUsers(usersData.users || []);

      // İstatistikleri hesapla
      const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
      const pendingOrders = ordersData.orders?.filter(order => order.status === 'pending').length || 0;
      const completedOrders = ordersData.orders?.filter(order => order.status === 'completed').length || 0;

      setStats({
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue,
        totalUsers: usersData.users?.length || 0,
        totalMessages: messagesData.messages?.length || 0,
        pendingOrders,
        completedOrders
      });

      setLoading(false);
    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Admin Paneli Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900">Pizza Krallığı Admin Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">Admin Girişi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen Sipariş</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'orders', name: 'Siparişler', icon: ShoppingCart },
                { id: 'messages', name: 'Mesajlar', icon: MessageSquare },
                { id: 'users', name: 'Kullanıcılar', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tüm Siparişler</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz sipariş bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">Sipariş #{order.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span>{order.status === 'completed' ? 'Tamamlandı' : order.status === 'pending' ? 'Bekliyor' : 'İptal'}</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{formatPrice(order.totalPrice)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Müşteri Bilgileri</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{order.customerName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{order.customerPhone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{order.customerEmail}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{order.deliveryAddress}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Sipariş Detayları</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {order.customerMessage && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">Müşteri Mesajı</h4>
                            <p className="text-blue-800 text-sm">{order.customerMessage}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Destek Mesajları</h3>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz mesaj bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">Mesaj #{message.id}</span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {message.status === 'unread' ? 'Okunmamış' : 'Okundu'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(message.createdAt)}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Gönderen Bilgileri</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{message.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{message.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{message.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Mesaj</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{message.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kayıtlı Kullanıcılar</h3>
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz kullanıcı bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{user.name}</h4>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Kayıt: {formatDate(user.createdAt)}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone || 'Belirtilmemiş'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Son giriş: {user.lastLogin ? formatDate(user.lastLogin) : 'Hiç giriş yapmamış'}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
