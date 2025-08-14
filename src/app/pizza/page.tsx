'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PizzaIngredientsAnimation from '@/components/PizzaIngredientsAnimation';

interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'first-order' | 'buy-two-get-one';
  discount: number;
  isActive: boolean;
}

export default function PizzaHomePage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [showCampaignMessage, setShowCampaignMessage] = useState(false);

  useEffect(() => {
    checkUserAuth();
    loadPizzas();
    loadCart();
    loadReviews();
  }, []);

  // Login sonrası auth state'i kontrol et
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('🔄 Sayfa yüklendiğinde auth kontrol ediliyor...');
      setTimeout(() => {
        checkUserAuth();
      }, 500); // Cookie'nin set olması için kısa bir bekleme
    };

    handleRouteChange();
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  const checkUserAuth = async () => {
    try {
      console.log('🔐 Auth kontrol ediliyor...');
      const response = await fetch('/api/auth/verify');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth verify response:', data);
        
        // Professional API response format'ını destekle
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          console.log('✅ Kullanıcı giriş yapmış:', data.data.user.email);
        } else if (data.user) {
          // Eski format için fallback
          setUser(data.user);
          console.log('✅ Kullanıcı giriş yapmış (legacy):', data.user.email);
        }
      } else {
        // 401 normal bir durum, kullanıcı giriş yapmamış
        console.log('ℹ️ Kullanıcı giriş yapmamış (401)');
        setUser(null);
      }
    } catch (error) {
      // Network hatası normal, sessizce geç
      console.log('⚠️ Auth check network error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPizzas = async () => {
    try {
      console.log('🍕 Pizza menüsü yükleniyor...');
      const response = await fetch('/api/pizza/menu');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Pizza menüsü API response:', data);
        
        // Professional API response format'ını destekle
        if (data.success && data.data) {
          setPizzas(data.data.pizzas || []);
          console.log(`📋 ${data.data.pizzas?.length || 0} pizza yüklendi (${data.data.source})`);
        } else {
          // Eski format için fallback
          setPizzas(data.pizzas || []);
          console.log(`📋 ${data.pizzas?.length || 0} pizza yüklendi (legacy)`);
        }
      } else {
        console.error('❌ Pizza menüsü API hatası:', response.status);
      }
    } catch (error) {
      console.error('❌ Pizza yükleme network hatası:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/pizza/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/pizza/campaigns');
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 Kampanyalar yüklendi:', data);
        
        // Professional API response format'ını destekle
        if (data.success && data.data?.campaigns) {
          setCampaigns(data.data.campaigns);
        } else if (data.campaigns) {
          // Eski format için fallback
          setCampaigns(data.campaigns);
        }
      } else {
        console.error('❌ Kampanyalar yüklenemedi:', response.status);
      }
    } catch (error) {
      console.error('❌ Kampanyalar yükleme hatası:', error);
    }
  };

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('pizza-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pizza-cart', JSON.stringify(newCart));
    }
  };

  const addToCart = (pizza: Pizza) => {
    const existingItem = cart.find(item => item.id === pizza.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...pizza, quantity: 1 }]);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCart([]);
      localStorage.removeItem('pizza-cart');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const submitReview = async () => {
    try {
      setReviewError('');
      const response = await fetch('/api/pizza/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      const data = await response.json();
      
      if (data.success) {
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        loadReviews(); // Reload reviews
      } else {
        setReviewError(data.error);
      }
    } catch (error) {
      setReviewError('Yorum eklenirken hata oluştu');
    }
  };



  const handleCampaignClick = () => {
    setShowCampaignMessage(true);
    setTimeout(() => {
      window.location.href = '/pizza/menu';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4">
            <Image
              src="/pizza-slices.gif"
              alt="Loading"
              width={128}
              height={128}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Campaign Message */}
      {showCampaignMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          🎉 Seçtiğiniz 3 pizza 2 fiyat değerinde! Menüye yönlendiriliyorsunuz...
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">🍕</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Pizza Palace</span>
              </div>

            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/pizza/menu" className="text-gray-700 hover:text-red-600 transition-colors">
                Menü
              </Link>
              <Link href="/pizza/orders" className="text-gray-700 hover:text-red-600 transition-colors">
                Siparişlerim
              </Link>
              
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🛒 Sepet
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hoş geldiniz,</span>
                  <Link 
                    href="/pizza/profile" 
                    className="text-orange-600 hover:text-orange-700 transition-colors flex items-center space-x-1 font-medium"
                  >
                    <span>👤</span>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <Link href="/pizza/login" className="text-gray-700 hover:text-red-600 transition-colors">
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 py-20 overflow-hidden">
        <PizzaIngredientsAnimation />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Lezzetli Pizzalar
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            En taze malzemelerle hazırlanan özel tariflerimizi keşfedin
          </p>
          <Link
            href="/pizza/menu"
            className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Menüyü Gör
          </Link>
        </div>
      </section>

      {/* Video Section - Lezzetli Pizzalar ve En Çok Sevilen Pizzalar arasında */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        >
          <source src="/pizzaanasayfa.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Popular Pizzas Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">En Çok Sevilen Pizzalar</h2>
            <p className="text-gray-600">Müşterilerimizin favorileri</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pizzas.slice(0, 3).map((pizza) => (
              <div key={pizza.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full min-h-[480px]">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{pizza.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(pizza.price)}</span>
                    <button
                      onClick={() => addToCart(pizza)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section - En Çok Sevilen Pizzalar altında */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        >
          <source src="/pizzaanasayfa2.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Pizza Palace?</h2>
            <p className="text-gray-600">Size en iyi hizmeti sunmak için çalışıyoruz</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">30 dakika içinde kapınızda</p>
            </div>
            <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Taze Malzemeler</h3>
              <p className="text-gray-600">Günlük taze malzemeler</p>
            </div>
            <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600">Güvenli online ödeme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Özel Teklifler</h2>
            <p className="text-gray-600">Kaçırmayın!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">🎉 İlk Sipariş İndirimi</h3>
              <p className="text-lg mb-4">
                {isFirstOrder 
                  ? 'İlk siparişinizde %20 indirim!'
                  : 'İlk sipariş indirimi kullanıldı'
                }
              </p>
              <Link 
                href="/pizza/menu"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-block ${
                  isFirstOrder 
                    ? 'bg-white text-red-600 hover:bg-gray-100' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFirstOrder ? 'Hemen Sipariş Ver' : 'Kullanıldı'}
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">🍕 3 Al 2 Öde</h3>
              <p className="text-lg mb-4">Seçili pizzalarda 3 al 2 öde kampanyası!</p>
              <button 
                onClick={handleCampaignClick}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Kampanyayı İncele
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Modern Yorum Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">💬 Yorum Ekle</h3>
                  <p className="text-gray-600 text-sm mt-1">Deneyiminizi diğer müşterilerle paylaşın</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {reviewError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ⭐ Puanınız
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-3xl transition-all duration-200 hover:scale-110 ${
                        star <= newReview.rating 
                          ? 'text-yellow-400 drop-shadow-sm' 
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    >
                      {star <= newReview.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {newReview.rating > 0 ? `${newReview.rating}/5 puan` : 'Puanınızı seçin'}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Yorumunuz
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={5}
                  placeholder="Pizza Palace deneyiminizi paylaşın... (En az 10 karakter)"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {newReview.comment.length}/500 karakter
                  </p>
                  <div className={`text-xs px-2 py-1 rounded ${
                    newReview.comment.length >= 10 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {newReview.comment.length >= 10 ? '✓ Yeterli' : 'En az 10 karakter'}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={submitReview}
                  disabled={newReview.rating === 0 || newReview.comment.length < 10}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span className="mr-2">📤</span>
                  Yorum Gönder
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sepet Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Sepetim</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-600">Sepetiniz boş</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600">🍕</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              const updatedCart = cart.map(cartItem =>
                                cartItem.id === item.id 
                                  ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                                  : cartItem
                              ).filter(cartItem => cartItem.quantity > 0);
                              saveCart(updatedCart);
                            }}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const updatedCart = cart.map(cartItem =>
                                cartItem.id === item.id 
                                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                  : cartItem
                              );
                              saveCart(updatedCart);
                            }}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Toplam:</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(cart.reduce((total, item) => total + (item.price * item.quantity), 0))}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        window.location.href = '/pizza/cart';
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Sepete Git
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <h3 className="text-xl font-semibold">Pizza Palace</h3>
              </div>
              <p className="text-gray-400">
                Lezzetli pizzalar ve hızlı teslimat için doğru adres.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><Link href="/pizza/menu" className="text-gray-400 hover:text-white transition-colors">Menü</Link></li>
                <li><Link href="/pizza/orders" className="text-gray-400 hover:text-white transition-colors">Siparişlerim</Link></li>
                <li><Link href="/pizza/profile" className="text-gray-400 hover:text-white transition-colors">Profil</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +90 555 123 4567</li>
                <li>📧 info@pizzapalace.com</li>
                <li>📍 İstanbul, Türkiye</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">📘</a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">📷</a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">🐦</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pizza Palace. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 