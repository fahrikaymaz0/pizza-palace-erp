'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CreditCard from '@/components/CreditCard';
import { makeTestPayment } from '@/lib/paymentAPI';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  minQuantity?: number;
  minAmount?: number;
  maxDiscount?: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Mevcut kuponlar
  const availableCoupons: Coupon[] = [
    {
      id: '3al2ode',
      code: '3AL2ODE',
      name: '3 Al 2 Öde',
      description: '3 pizza al, 2 tanesini öde',
      type: 'buy_x_get_y',
      value: 3,
      minQuantity: 3,
    },
    {
      id: 'firstorder',
      code: 'FIRST20',
      name: 'İlk Sipariş %20 İndirim',
      description: 'İlk siparişinizde %20 indirim',
      type: 'percentage',
      value: 20,
      maxDiscount: 50,
    },
    {
      id: 'freeshipping',
      code: 'FREESHIP',
      name: 'Ücretsiz Teslimat',
      description: '100₺ üzeri ücretsiz teslimat',
      type: 'fixed',
      value: 15,
      minAmount: 100,
    },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
    } else {
      router.push('/pizza/menu');
    }

    // Kullanıcının giriş yapmış olup olmadığını kontrol et
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Authentication durumunu yenile
  const refreshAuth = async () => {
    setAuthChecking(true);
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  // Sayfa odaklandığında authentication durumunu yenile
  useEffect(() => {
    const handleFocus = () => {
      refreshAuth();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('pizza-cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('pizza-cart', JSON.stringify(updatedCart));

    if (updatedCart.length === 0) {
      router.push('/pizza/menu');
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;

    const subtotal = getSubtotal();
    const totalQuantity = getTotalQuantity();

    switch (selectedCoupon.type) {
      case 'percentage':
        let discount = (subtotal * selectedCoupon.value) / 100;
        if (selectedCoupon.maxDiscount) {
          discount = Math.min(discount, selectedCoupon.maxDiscount);
        }
        return discount;

      case 'fixed':
        if (selectedCoupon.minAmount && subtotal < selectedCoupon.minAmount) {
          return 0;
        }
        return selectedCoupon.value;

      case 'buy_x_get_y':
        if (
          selectedCoupon.minQuantity &&
          totalQuantity < selectedCoupon.minQuantity
        ) {
          return 0;
        }
        // 3 al 2 öde mantığı: her 3'lü grup için en ucuz pizza bedava
        const freePizzas = Math.floor(totalQuantity / selectedCoupon.value);

        // Pizzaları fiyata göre sırala (en ucuzdan en pahalıya)
        const sortedItems = [...cart].sort((a, b) => a.price - b.price);

        let totalDiscount = 0;
        for (let i = 0; i < freePizzas; i++) {
          // Her grup için en ucuz pizzayı bedava yap
          const freeItemIndex = i * selectedCoupon.value;
          if (sortedItems[freeItemIndex]) {
            totalDiscount += sortedItems[freeItemIndex].price;
          }
        }

        return totalDiscount;

      default:
        return 0;
    }
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal - discount);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Lütfen bir kupon kodu girin!');
      return;
    }

    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (coupon) {
      // Kupon koşullarını kontrol et
      if (coupon.minQuantity && getTotalQuantity() < coupon.minQuantity) {
        alert(`Bu kupon için minimum ${coupon.minQuantity} ürün gereklidir!`);
        return;
      }

      if (coupon.minAmount && getSubtotal() < coupon.minAmount) {
        alert(
          `Bu kupon için minimum ${coupon.minAmount}₺ tutarında alışveriş gereklidir!`
        );
        return;
      }

      setSelectedCoupon(coupon);
      setCouponCode('');
    } else {
      alert('Geçersiz kupon kodu!');
    }
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Telefon numarası formatı
  const formatPhoneNumber = (value: string) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, '');

    // Türkiye telefon numarası formatı
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
    }
  };

  // Telefon numarası validasyonu
  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    // Türkiye telefon numarası: 10 haneli (5XX XXX XX XX)
    return numbers.length === 10 && numbers.startsWith('5');
  };

  const validatePaymentForm = () => {
    const errors: { [key: string]: string } = {};

    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.cardNumber = 'Geçerli bir kart numarası giriniz!';
    }

    if (!cardHolder.trim()) {
      errors.cardHolder = 'Kart sahibi adı gereklidir!';
    }

    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      errors.expiryDate = 'Geçerli bir son kullanma tarihi giriniz!';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.expiryDate = 'Geçersiz ay!';
      } else if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        errors.expiryDate = 'Kart süresi dolmuş!';
      }
    }

    if (!cvv.match(/^\d{3,4}$/)) {
      errors.cvv = 'Geçerli bir CVV giriniz!';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      alert('Teslimat adresi gereklidir!');
      return;
    }

    if (!phone.trim()) {
      alert('Telefon numarası gereklidir!');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert('Geçerli bir telefon numarası giriniz!');
      return;
    }

    // Ödeme formunu göster
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    // Ödeme öncesi authentication kontrolü
    try {
      const authResponse = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (!authResponse.ok) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/pizza/login');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      router.push('/pizza/login');
      return;
    }

    setLoading(true);
    try {
      // Önce test ödeme işlemini gerçekleştir
      const paymentData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        cvv: cvv,
      };

      console.log('🔄 Test ödeme işlemi başlatılıyor...');
      const paymentResult = (await makeTestPayment(
        paymentData,
        getFinalTotal()
      )) as any;

      if (paymentResult && paymentResult.success) {
        console.log('✅ Test ödeme başarılı!');
        console.log(`İşlem No: ${paymentResult.transactionId}`);
        console.log(`Banka: ${paymentResult.bank}`);
        console.log(`Tutar: ₺${paymentResult.amount}`);

        // Ödeme başarılıysa siparişi oluştur
        const response = await fetch('/api/pizza/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            items: cart,
            address: deliveryAddress,
            phone: phone,
            notes: notes,
            coupon: selectedCoupon?.code,
            total_amount: getFinalTotal(),
            payment: {
              cardNumber: cardNumber.replace(/\s/g, ''),
              cardHolder: cardHolder,
              expiryDate: expiryDate,
              cvv: cvv,
            },
            transactionInfo: {
              transactionId: paymentResult.transactionId,
              authCode: paymentResult.authCode,
              bank: paymentResult.bank,
              paymentMethod: 'credit_card',
            },
          }),
        });

        if (response.ok) {
          localStorage.removeItem('pizza-cart');

          // Başarı mesajını göster ve siparişler sayfasına yönlendir
          const successMessage = `✅ Ödeme başarılı!\n\n📋 Sipariş Detayları:\n• İşlem No: ${paymentResult.transactionId}\n• Banka: ${paymentResult.bank}\n• Tutar: ₺${paymentResult.amount}\n\n🔄 Siparişiniz pizza admin tarafından onaylanmayı bekliyor.\n\nSiparişleriniz sayfasına yönlendiriliyorsunuz...`;

          alert(successMessage);
          router.push('/pizza/orders?newOrder=true');
        } else {
          const errorData = await response.json();
          console.error('Sipariş oluşturma hatası:', errorData);

          if (response.status === 401) {
            alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            router.push('/pizza/login');
          } else {
            alert(
              `Sipariş oluşturulurken hata oluştu: ${errorData.error || 'Bilinmeyen hata'}`
            );
          }
        }
      } else {
        console.error('❌ Test ödeme başarısız:', paymentResult);
        alert(
          `Ödeme işlemi başarısız: ${paymentResult.friendlyMessage || paymentResult.error}`
        );
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sepetiniz Boş
          </h2>
          <p className="text-gray-600 mb-6">
            Sipariş vermek için önce menüden pizza seçin.
          </p>
          <button
            onClick={() => router.push('/pizza/menu')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Menüye Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xl">🍕</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pizza Palace</h1>
          </div>
          <button
            onClick={() => router.push('/pizza/menu')}
            className="text-red-600 hover:text-red-700 font-medium flex items-center transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Menüye Dön
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Pizza Listesi */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Seçilen Pizzalar ({getTotalQuantity()})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl shadow-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-red-600 font-medium">
                        ₺{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-semibold bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teslimat Bilgileri */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Teslimat Bilgileri
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teslimat Adresi *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tam adresinizi girin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(formatPhoneNumber(e.target.value))}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="5XX XXX XX XX"
                    maxLength={13}
                  />
                  {phone && !validatePhoneNumber(phone) && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Geçerli bir Türkiye telefon numarası giriniz (5XX XXX XX
                      XX)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Özel istekleriniz..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Özet ve Kuponlar */}
          <div className="space-y-6">
            {/* Kuponlar */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Kuponlar
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {selectedCoupon ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-800">
                          {selectedCoupon.name}
                        </p>
                        <p className="text-sm text-green-600">
                          {selectedCoupon.description}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Kupon kodu girin..."
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            applyCoupon();
                          }
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-semibold text-sm min-w-[80px]"
                      >
                        Uygula
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Mevcut Kuponlar:
                      </p>
                      {availableCoupons.map(coupon => {
                        const isEligible =
                          (!coupon.minQuantity ||
                            getTotalQuantity() >= coupon.minQuantity) &&
                          (!coupon.minAmount ||
                            getSubtotal() >= coupon.minAmount);

                        return (
                          <button
                            key={coupon.id}
                            onClick={() => {
                              if (!isEligible) {
                                if (
                                  coupon.minQuantity &&
                                  getTotalQuantity() < coupon.minQuantity
                                ) {
                                  alert(
                                    `Bu kupon için minimum ${coupon.minQuantity} ürün gereklidir!`
                                  );
                                  return;
                                }

                                if (
                                  coupon.minAmount &&
                                  getSubtotal() < coupon.minAmount
                                ) {
                                  alert(
                                    `Bu kupon için minimum ${coupon.minAmount}₺ tutarında alışveriş gereklidir!`
                                  );
                                  return;
                                }
                                return;
                              }

                              setSelectedCoupon(coupon);
                              setCouponCode('');
                            }}
                            disabled={!isEligible}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                              isEligible
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300'
                                : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p
                                  className={`font-semibold ${isEligible ? 'text-green-800' : 'text-gray-500'}`}
                                >
                                  {coupon.name}
                                </p>
                                <p
                                  className={`text-sm ${isEligible ? 'text-green-600' : 'text-gray-400'}`}
                                >
                                  {coupon.description}
                                </p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  isEligible
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-400 text-gray-200'
                                }`}
                              >
                                {isEligible ? 'UYGULA' : 'UYGUN DEĞİL'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fiyat Özeti */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Fiyat Özeti
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam ({getTotalQuantity()} ürün)</span>
                  <span className="font-medium">
                    ₺{getSubtotal().toFixed(2)}
                  </span>
                </div>

                {selectedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>{selectedCoupon.name}</span>
                    <span className="font-semibold">
                      -₺{calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Toplam
                    </span>
                    <div className="text-right">
                      {selectedCoupon && (
                        <p className="text-sm text-gray-500 line-through">
                          ₺{getSubtotal().toFixed(2)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-red-600">
                        ₺{getFinalTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {authChecking ? (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Kontrol ediliyor...
                    </div>
                  </button>
                ) : !isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="text-yellow-800 font-medium">
                          Sipariş vermek için giriş yapmanız gerekiyor
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/pizza/login')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                      Giriş Yap
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-green-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-green-800 font-medium">
                            Giriş yapıldı
                          </span>
                        </div>
                        <button
                          onClick={refreshAuth}
                          disabled={authChecking}
                          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-all duration-200"
                          title="Durumu yenile"
                        >
                          <svg
                            className={`w-4 h-4 ${authChecking ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          İşleniyor...
                        </div>
                      ) : (
                        'Ödeme ile Devam Et'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ödeme Formu Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  Güvenli Ödeme
                </h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Sol Taraf - Kredi Kartı Görselleştirmesi */}
                <div className="flex justify-center items-center">
                  <CreditCard
                    cardNumber={cardNumber}
                    cardHolder={cardHolder}
                    expiryDate={expiryDate}
                    cvv={cvv}
                    focused={focusedField}
                  />
                </div>

                {/* Sağ Taraf - Ödeme Formu */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Kart Numarası
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      onFocus={() => setFocusedField('cardNumber')}
                      onBlur={() => setFocusedField('')}
                      maxLength={19}
                      className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg font-mono ${
                        paymentErrors.cardNumber
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {paymentErrors.cardNumber && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {paymentErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Kart Sahibi
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e =>
                        setCardHolder(e.target.value.toUpperCase())
                      }
                      onFocus={() => setFocusedField('cardHolder')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg ${
                        paymentErrors.cardHolder
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="AD SOYAD"
                    />
                    {paymentErrors.cardHolder && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {paymentErrors.cardHolder}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Son Kullanma Tarihi
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={e =>
                          setExpiryDate(formatExpiryDate(e.target.value))
                        }
                        onFocus={() => setFocusedField('expiryDate')}
                        onBlur={() => setFocusedField('')}
                        maxLength={5}
                        className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg font-mono ${
                          paymentErrors.expiryDate
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="MM/YY"
                      />
                      {paymentErrors.expiryDate && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {paymentErrors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={e =>
                          setCvv(e.target.value.replace(/\D/g, ''))
                        }
                        onFocus={() => setFocusedField('cvv')}
                        onBlur={() => setFocusedField('')}
                        maxLength={4}
                        className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg font-mono ${
                          paymentErrors.cvv
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="123"
                      />
                      {paymentErrors.cvv && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {paymentErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sipariş Özeti */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
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
                      Sipariş Özeti
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Ara Toplam:</span>
                        <span>₺{getSubtotal().toFixed(2)}</span>
                      </div>
                      {selectedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>{selectedCoupon.name}:</span>
                          <span>-₺{calculateDiscount().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
                        <span>Toplam:</span>
                        <span className="text-red-600">
                          ₺{getFinalTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-5 px-6 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl transform hover:scale-105 border border-red-500"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-lg">Ödeme İşleniyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-lg">Ödemeyi Tamamla</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
