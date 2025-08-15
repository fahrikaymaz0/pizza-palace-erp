import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PizzaPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    delivery_address: '',
    phone: '',
    notes: ''
  });

  // API URL - Production'da localhost'a yönlendir
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api' 
    : '/api';

  useEffect(() => {
    checkAuth();
    loadPizzas();
    loadUser();
  }, []);

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const checkAuth = async () => {
    try {
      console.log('🔐 Checking auth...');
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        console.log('✅ Auth check successful');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPizzas = async () => {
    try {
      console.log('🍕 Loading pizzas from localhost backend...');
      const response = await fetch(`${API_BASE}/pizza/menu`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPizzas(result.data);
          console.log('✅ Pizzas loaded from backend:', result.data.length);
        } else {
          console.error('❌ Backend error:', result.error);
          loadStaticPizzas();
        }
      } else {
        console.error('❌ Backend not available, using static data');
        loadStaticPizzas();
      }
    } catch (error) {
      console.error('❌ Load pizzas error:', error);
      loadStaticPizzas();
    }
  };

  const loadStaticPizzas = () => {
    const pizzaData = [
      { id: 1, name: 'Margherita', price: 45, image: '/pizzas/margherita.png' },
      { id: 2, name: 'Pepperoni', price: 55, image: '/pizzas/pepperoni.png' },
      { id: 3, name: 'Quattro Stagioni', price: 65, image: '/pizzas/quattro-stagioni.png' },
      { id: 4, name: 'Vegetarian', price: 50, image: '/pizzas/vegetarian.png' },
      { id: 5, name: 'BBQ Chicken', price: 60, image: '/pizzas/bbq-chicken.png' },
      { id: 6, name: 'Supreme', price: 70, image: '/pizzas/supreme.png' },
    ];
    setPizzas(pizzaData);
    console.log('✅ Static pizzas loaded:', pizzaData.length);
  };

  const addToCart = (pizza) => {
    const existingItem = cart.find(item => item.id === pizza.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === pizza.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...pizza, quantity: 1 }]);
    }
  };

  const removeFromCart = (pizzaId) => {
    setCart(cart.filter(item => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId);
    } else {
      setCart(cart.map(item => 
        item.id === pizzaId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Sipariş vermek için giriş yapmalısınız!');
      return;
    }

    if (cart.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    try {
      console.log('📋 Creating order...');
      
      const response = await fetch(`${API_BASE}/pizza/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          total_amount: getTotalPrice(),
          delivery_address: orderForm.delivery_address,
          phone: orderForm.phone,
          notes: orderForm.notes,
          items: cart
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Sipariş başarıyla oluşturuldu! Sipariş No: ${result.data.order_id}`);
        setCart([]);
        setShowOrderForm(false);
        setOrderForm({ delivery_address: '', phone: '', notes: '' });
      } else {
        const errorData = await response.json();
        alert('Sipariş oluşturulamadı: ' + errorData.error);
      }
    } catch (error) {
      console.error('❌ Order error:', error);
      alert('Sipariş sırasında hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pizza Palace - Menü</title>
        <meta name="description" content="Pizza Palace menü" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🍕 Pizza Palace Menü</h1>
            <p className="text-white text-lg">En lezzetli pizzalarımızı keşfedin</p>
            {user && (
              <p className="text-white text-sm mt-2">Hoş geldiniz, {user.name}!</p>
            )}
          </div>

          {/* Pizza Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pizzas.map((pizza) => (
              <div key={pizza.id} className="bg-white bg-opacity-20 rounded-lg p-6 hover:bg-opacity-30 transition duration-300">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{pizza.name}</h3>
                  <p className="text-white text-lg font-semibold">₺{pizza.price}</p>
                  <button 
                    onClick={() => addToCart(pizza)}
                    className="mt-4 bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">🛒 Sepetiniz</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white bg-opacity-10 p-3 rounded-lg">
                    <div>
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-white text-sm">₺{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <p className="text-white text-xl font-bold">Toplam: ₺{getTotalPrice()}</p>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                  >
                    Sipariş Ver
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order Form */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">📋 Sipariş Bilgileri</h2>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Teslimat Adresi</label>
                    <input
                      type="text"
                      required
                      value={orderForm.delivery_address}
                      onChange={(e) => setOrderForm({...orderForm, delivery_address: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Adresinizi girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Telefon numaranız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notlar</label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ek notlarınız"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Siparişi Onayla
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 