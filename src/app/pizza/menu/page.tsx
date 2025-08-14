'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function PizzaMenu() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUserStatus();
    loadMenu();
    loadCart();
  }, []);

  const normalizePizzas = (list: any): Pizza[] => {
    if (!Array.isArray(list)) return [];
    return list.map((p: any) => ({
      id: typeof p.id === 'number' ? p.id : Number(p.id),
      name: p.name,
      description: p.description,
      price: Number(p.price),
      image: p.image || p.image_url || '/pizzas/margherita.png',
      category: p.category || 'Klasik',
    }));
  };

  const normalizeCategories = (list: any): Category[] => {
    if (!Array.isArray(list)) return [];
    if (list.length > 0 && typeof list[0] === 'string') {
      return (list as string[]).map((name, index) => ({ id: index + 1, name }));
    }
    return list as Category[];
  };

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/pizza/auth/verify', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Kullanıcı kontrolü hatası:', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await fetch('/api/pizza/menu');
      const raw = await response.json();
      // Hem professional (data.pizzas) hem de legacy (pizzas) formatını destekle
      const payload =
        raw?.data &&
        (Array.isArray(raw.data.pizzas) || Array.isArray(raw.data.categories))
          ? raw.data
          : raw;
      const nextPizzas = normalizePizzas(payload?.pizzas);
      const nextCategories = normalizeCategories(payload?.categories);
      setPizzas(nextPizzas);
      setCategories(nextCategories);
    } catch (error) {
      console.error('Menü yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('pizza-cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (pizza: Pizza) => {
    const existingItem = cart.find(item => item.id === pizza.id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity: 1,
        image: pizza.image,
      };
      saveCart([...cart, newItem]);
    }
  };

  const removeFromCart = (pizzaId: number) => {
    const updatedCart = cart.filter(item => item.id !== pizzaId);
    saveCart(updatedCart);
  };

  const updateQuantity = (pizzaId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === pizzaId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/pizza/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const filteredPizzas =
    selectedCategory === 'all'
      ? pizzas
      : pizzas.filter(pizza => pizza.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/pizza-slices.gif"
              alt="Loading..."
              width={128}
              height={128}
              priority
            />
          </div>
          <p className="text-gray-600 mt-4">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">🍕</span>
              </div>
              <h1 className="text-2xl font-bold text-red-600">Pizza Palace</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/pizza"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link href="/pizza/menu" className="text-red-600 font-semibold">
                Menü
              </Link>
              <Link
                href="/pizza/orders"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Siparişlerim
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Sepet Butonu */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🛒 Sepet
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link
                  href="/pizza/login"
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

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
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600">🍕</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        router.push('/pizza/cart');
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Menümüz</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50'
              }`}
            >
              Tümü
            </button>
            {Array.isArray(categories) &&
              categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-red-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPizzas.map(pizza => (
            <div
              key={pizza.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center overflow-hidden relative">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pizza.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {pizza.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(pizza.price)}
                  </span>
                  <button
                    onClick={() => addToCart(pizza)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
