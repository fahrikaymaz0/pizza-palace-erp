'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Mock data
  const mockOrders = [
    {
      id: '1',
      customerName: 'Ahmet Yılmaz',
      customerEmail: 'ahmet@email.com',
      customerPhone: '0555 123 45 67',
      deliveryAddress: 'Kadıköy, İstanbul',
      totalPrice: 189,
      status: 'completed',
      customerMessage: 'Lütfen acil teslimat yapın',
      items: [
        { name: 'Royal Margherita', quantity: 1, price: 89 },
        { name: 'Imperial Pepperoni', quantity: 1, price: 99 }
      ],
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T15:45:00Z'
    },
    {
      id: '2',
      customerName: 'Fatma Demir',
      customerEmail: 'fatma@email.com',
      customerPhone: '0555 987 65 43',
      deliveryAddress: 'Beşiktaş, İstanbul',
      totalPrice: 129,
      status: 'pending',
      customerMessage: 'Vejetaryen pizza istiyorum',
      items: [
        { name: 'Royal Vegetarian', quantity: 1, price: 79 },
        { name: 'Mediterranean Dream', quantity: 1, price: 94 }
      ],
      createdAt: '2024-01-15T16:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z'
    }
  ];

  const mockMessages = [
    {
      id: '1',
      name: 'Ali Veli',
      email: 'ali@email.com',
      phone: '0555 111 22 33',
      message: 'Pizzalarınız çok lezzetli! Teşekkürler.',
      status: 'unread',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Ayşe Özkan',
      email: 'ayse@email.com',
      phone: '0555 444 55 66',
      message: 'Teslimat süresi hakkında bilgi almak istiyorum.',
      status: 'read',
      createdAt: '2024-01-15T09:15:00Z'
    }
  ];

  const mockUsers = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@email.com',
      phone: '0555 123 45 67',
      createdAt: '2024-01-10T10:30:00Z',
      orderCount: 3
    },
    {
      id: '2',
      name: 'Fatma Demir',
      email: 'fatma@email.com',
      phone: '0555 987 65 43',
      createdAt: '2024-01-12T14:20:00Z',
      orderCount: 1
    }
  ];

  const handleTabChange = useCallback((tab) => {
    if (!mountedRef.current) return;
    setActiveTab(tab);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  }, []);

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = mockOrders.length;
  const totalUsers = mockUsers.length;
  const totalMessages = mockMessages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hoş geldiniz, Admin</span>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue}₺</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mesajlar</p>
                <p className="text-2xl font-bold text-gray-900">{totalMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'orders', name: 'Siparişler', icon: ShoppingCart },
                { id: 'messages', name: 'Mesajlar', icon: MessageSquare },
                { id: 'users', name: 'Kullanıcılar', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status === 'completed' ? 'Tamamlandı' : 
                           order.status === 'pending' ? 'Beklemede' : 'İptal'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">{order.totalPrice}₺</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><Phone className="w-3 h-3 inline mr-1" /> {order.customerPhone}</p>
                      <p><MapPin className="w-3 h-3 inline mr-1" /> {order.deliveryAddress}</p>
                      <p><Calendar className="w-3 h-3 inline mr-1" /> {formatDate(order.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'unread' ? 'Okunmamış' : 'Okunmuş'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                    <div className="text-xs text-gray-500">
                      <p><Mail className="w-3 h-3 inline mr-1" /> {message.email}</p>
                      <p><Phone className="w-3 h-3 inline mr-1" /> {message.phone}</p>
                      <p><Calendar className="w-3 h-3 inline mr-1" /> {formatDate(message.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Sipariş: {user.orderCount}</p>
                        <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
