"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface BinInfo {
  bank: string;
  type: string;
  subType: string;
  virtual: boolean;
  prepaid: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Credit card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  
  // BIN info
  const [binInfo, setBinInfo] = useState<BinInfo | null>(null);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
      const totalAmount = cartData.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      setTotal(totalAmount);
    } else {
      router.push('/pizza/menu');
    }
  }, []);

  // BIN verification
  useEffect(() => {
    if (cardNumber.length >= 6) {
      verifyBin();
    } else {
      setBinInfo(null);
      setCardType(null);
    }
  }, [cardNumber]);

  const verifyBin = async () => {
    try {
      const response = await fetch('/api/pizza/verify-bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBinInfo(data.data);
        setCardType(data.data.type.toLowerCase() as 'visa' | 'mastercard');
      } else {
        setBinInfo(null);
        setCardType(null);
      }
    } catch (error) {
      console.error('BIN verification error:', error);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!deliveryAddress.trim()) {
      setError('Teslimat adresi gerekli');
      setLoading(false);
      return;
    }
    
    if (!phone.trim()) {
      setError('Telefon numarası gerekli');
      setLoading(false);
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Geçerli kart numarası girin');
      setLoading(false);
      return;
    }

    if (!cardHolder.trim()) {
      setError('Kart sahibi adı gerekli');
      setLoading(false);
      return;
    }

    if (!expiryMonth || !expiryYear) {
      setError('Son kullanma tarihi gerekli');
      setLoading(false);
      return;
    }

    if (cvv.length < 3) {
      setError('CVV gerekli');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/pizza/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          address: deliveryAddress,
          phone: phone,
          notes: notes,
          total_amount: total
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear cart
        localStorage.removeItem('pizza-cart');
        router.push('/pizza/orders');
      } else {
        setError(data.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
          <p className="text-gray-600 mb-6">Sipariş vermek için önce menüden pizza seçin.</p>
          <button
            onClick={() => router.push('/pizza/menu')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Menüye Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sipariş Tamamla</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.quantity} adet</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Toplam:</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Teslimat Bilgileri</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Delivery Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Adresi *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tam adresinizi girin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+90 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Özel istekleriniz..."
                />
              </div>

              {/* Credit Card Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Ödeme Bilgileri</h3>
                
                {/* Virtual Card Display */}
                <div className="mb-6">
                  <div className={`relative w-full h-48 rounded-xl p-6 text-white ${
                    cardType === 'visa' ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
                    cardType === 'mastercard' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                    'bg-gradient-to-br from-gray-600 to-gray-800'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">Kart Sahibi</p>
                        <p className="font-semibold">{cardHolder || 'AD SOYAD'}</p>
                      </div>
                      <div className="text-right">
                        {cardType === 'visa' && (
                          <div className="text-2xl font-bold">VISA</div>
                        )}
                        {cardType === 'mastercard' && (
                          <div className="text-2xl font-bold">MASTERCARD</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <p className="text-sm opacity-80">Kart Numarası</p>
                      <p className="font-mono text-xl tracking-wider">
                        {cardNumber || '**** **** **** ****'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-6">
                      <div>
                        <p className="text-sm opacity-80">Son Kullanma</p>
                        <p className="font-semibold">
                          {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">CVV</p>
                        <p className="font-semibold">{cvv || '***'}</p>
                      </div>
                    </div>
                    
                    {binInfo && (
                      <div className="absolute bottom-4 left-6">
                        <p className="text-xs opacity-80">{binInfo.bank}</p>
                        <p className="text-xs opacity-80">{binInfo.subType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Numarası *
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Sahibi *
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="AD SOYAD"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ay *
                      </label>
                      <select
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Ay</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yıl *
                      </label>
                      <select
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Yıl</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sipariş Veriliyor...' : `₺${total.toFixed(2)} - Siparişi Tamamla`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
