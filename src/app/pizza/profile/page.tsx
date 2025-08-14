'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  last_login: string;
  total_orders: number;
  total_spent: number;
}

interface Order {
  id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadRecentOrders();
  }, []);

  const loadUserProfile = async () => {
    try {
      console.log('🔐 Profile sayfası auth kontrolü yapılıyor...');
      
      // Önce auth kontrolü yap
      const authResponse = await fetch('/api/auth/verify', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        console.log('⚠️ Auth kontrolü başarısız (401 normal olabilir), profile API deneniyor...');
        // Auth başarısız olsa bile profile API'yi dene
      } else {
        console.log('✅ Auth kontrolü başarılı');
      }

      const response = await fetch('/api/pizza/profile', {
        credentials: 'include'
      });

      console.log(`📡 Profile API response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('📄 Profile data:', data);
        
        // Professional API response format'ını destekle
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          setEditForm({
            name: data.data.user.name,
            email: data.data.user.email
          });
          console.log('✅ Profile yüklendi (professional format)');
        } else if (data.success && data.user) {
          // Legacy format
          setUser(data.user);
          setEditForm({
            name: data.user.name,
            email: data.user.email
          });
          console.log('✅ Profile yüklendi (legacy format)');
        } else {
          console.log('❌ Profile API response format hatası');
          setError('Profil verisi yüklenemedi');
        }
      } else if (response.status === 401) {
        console.log('🔐 Profile API 401 - login gerekli');
        setError('Giriş yapmış olmanız gerekiyor');
        setTimeout(() => {
          router.push('/pizza/login');
        }, 2000); // 2 saniye bekle
      } else {
        console.log(`❌ Profile API hatası: ${response.status}`);
        setError('Profil yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('❌ Profile loading network error:', error);
      setError('Profil yüklenirken network hatası oluştu');
      // Network hatası için direkt login'e yönlendirme
    } finally {
      setLoading(false);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await fetch('/api/pizza/orders', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRecentOrders(data.orders.slice(0, 3)); // Son 3 sipariş
        }
      }
    } catch (error) {
      console.error('Orders loading error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/pizza/auth/logout', { method: 'POST' });
      router.push('/pizza');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pizza/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        const nextUser = data.data?.user || data.user; // professional veya legacy
        if (nextUser) {
          setUser(nextUser);
        }
        setIsEditing(false);
        setSuccess('Profil başarıyla güncellendi');
      } else {
        setError(data.error || 'Profil güncellenemedi');
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const sendEmailVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user?.email
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowVerificationModal(true);
        setSuccess('Doğrulama kodu email adresinize gönderildi');
      } else {
        setError(data.error || 'Email gönderilemedi');
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    setError('');

    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      setError('6 haneli doğrulama kodunu giriniz');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user?.email,
          code: emailVerificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowVerificationModal(false);
        setEmailVerificationCode('');
        setSuccess('Email başarıyla doğrulandı! Artık siparişleriniz email adresinize gönderilecek');
        loadUserProfile(); // Profili yeniden yükle
      } else {
        setError(data.error || 'Doğrulama başarısız');
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Onay Bekliyor';
      case 'approved': return 'Hazırlanıyor';
      case 'delivering': return 'Kuryede';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <Image
              src="/pizza-slices.gif"
              alt="Loading"
              width={64}
              height={64}
              className="animate-spin"
            />
          </div>
          <p className="text-gray-600 font-medium">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h1>
          <p className="text-gray-600 mb-4">Profilinizi görüntülemek için giriş yapın</p>
          <Link href="/pizza/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pizza" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🍕</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pizza Palace</h1>
                <p className="text-sm text-gray-600 font-medium">Profil</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/pizza/menu" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Menü
              </Link>
              <Link href="/pizza/orders" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Siparişlerim
              </Link>
              <Link href="/pizza/reviews" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Yorumlarım
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <span className="text-red-500 mr-2">✗</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
                    <p className="text-gray-600 mt-1">Kişisel bilgilerinizi yönetin</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center"
                    >
                      <span className="mr-2">✏️</span>
                      Düzenle
                    </button>
                  )}
                </div>

                {isEditing ? (
                  // Edit Form
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Adresi
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="ornek?.com"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg disabled:bg-red-400 font-medium transition-colors"
                      >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Info
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad
                        </label>
                        <p className="text-gray-900 font-medium text-lg">{user.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Adresi
                        </label>
                        <div className="flex items-center space-x-3">
                          <p className="text-gray-900 font-medium">{user.email}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.email_verified 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {user.email_verified ? '✓ Doğrulanmış' : '✗ Doğrulanmamış'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Üyelik Tarihi
                        </label>
                        <p className="text-gray-900">{formatDate(user.created_at)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Toplam Sipariş
                        </label>
                        <p className="text-gray-900 font-medium">{user.total_orders} sipariş</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Toplam Harcama
                        </label>
                        <p className="text-gray-900 font-medium">{formatPrice(user.total_spent)}</p>
                      </div>
                    </div>

                    {/* Email Verification Section */}
                    {!user.email_verified && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-yellow-600 text-2xl">⚠️</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                              Email Doğrulama Gerekli
                            </h3>
                            <p className="text-yellow-700 mb-4">
                              Email adresinizi doğrulamadığınız için sipariş detayları email adresinize gönderilmeyecek. 
                              Doğrulama yaparak sipariş takibi ve özel tekliflerden haberdar olun.
                            </p>
                            
                            {!showVerificationModal ? (
                              <button
                                onClick={sendEmailVerification}
                                disabled={loading}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg disabled:bg-yellow-400 font-medium transition-colors"
                              >
                                {loading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                              </button>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-yellow-800 mb-2">
                                    6 Haneli Doğrulama Kodu
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={6}
                                    value={emailVerificationCode}
                                    onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-center text-xl font-mono tracking-widest"
                                    placeholder="000000"
                                  />
                                </div>
                                <div className="flex space-x-4">
                                  <button
                                    onClick={verifyEmail}
                                    disabled={loading}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg disabled:bg-yellow-400 font-medium transition-colors"
                                  >
                                    {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                                  </button>
                                  <button
                                    onClick={() => setShowVerificationModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                  >
                                    İptal
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              {recentOrders.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Son Siparişler</h3>
                      <p className="text-gray-600 mt-1">Son siparişlerinizin durumu</p>
                    </div>
                    <Link 
                      href="/pizza/orders"
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Tümünü Gör →
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-sm text-gray-500">#{order.id.slice(-8)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-gray-900 font-medium">
                              {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                            </p>
                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Profil Bilgileri</div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Telefon</div>
                      <input
                        type="tel"
                        name="phone"
                        value={(editForm as any).phone || ''}
                        onChange={handleInputChange as any}
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Link 
                    href="/pizza/menu"
                    className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🍕</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-red-600">Menü</h4>
                        <p className="text-sm text-gray-600">Pizza siparişi ver</p>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    href="/pizza/orders"
                    className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📦</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-red-600">Siparişlerim</h4>
                        <p className="text-sm text-gray-600">Sipariş takibi</p>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    href="/pizza/reviews"
                    className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-red-600">Yorumlarım</h4>
                        <p className="text-sm text-gray-600">Deneyimini paylaş</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Hesap İstatistikleri</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-red-100">Toplam Sipariş</span>
                    <span className="font-bold text-xl">{user.total_orders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-100">Toplam Harcama</span>
                    <span className="font-bold text-xl">{formatPrice(user.total_spent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-100">Üyelik Süresi</span>
                    <span className="font-bold text-xl">
                      {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} gün
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 