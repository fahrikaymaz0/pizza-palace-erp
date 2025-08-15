'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
}

export default function PizzaHomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    checkAuth();
    loadPizzas();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔄 CACHE-BREAKING AUTH CHECK - Yeni endpoint kullanılıyor');
      
      const response = await fetch('/api/auth/unified-verify', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      const data = await response.json();
      console.log('📡 Auth check response:', data);

      if (data.success) {
        setUser(data.data.user);
        console.log('✅ User authenticated:', data.data.user.email);
      } else {
        console.log('ℹ️ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPizzas = async () => {
    try {
      const response = await fetch('/api/v2/pizza/menu', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPizzas(data.data || []);
      }
    } catch (error) {
      console.error('Pizza loading error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍕</div>
          <p className="text-white text-xl">Pizza Palace Yükleniyor...</p>
          <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm">
            <p className="text-blue-800 font-semibold">🔄 Cache-Breaking Version</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">🍕 Pizza Palace</h1>
              <div className="ml-4 bg-blue-50 px-3 py-1 rounded-lg">
                <p className="text-blue-800 text-sm font-semibold">Cache-Breaking V2</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hoş geldin, {user.name}!</span>
                  <a
                    href="/pizza/orders"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Siparişlerim
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <a
                    href="/pizza/login"
                    className="text-gray-700 hover:text-gray-900 transition duration-200"
                  >
                    Giriş Yap
                  </a>
                  <a
                    href="/pizza/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Kayıt Ol
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Pizza Menu Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lezzetli Pizzalarımız</h2>
            <p className="text-xl text-gray-600">Taze malzemelerle hazırlanan özel tariflerimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzas.slice(0, 6).map((pizza) => (
              <div key={pizza.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
                  <span className="text-6xl">🍕</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 mb-4">{pizza.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">{pizza.price}₺</span>
                    {user ? (
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-200">
                        Sepete Ekle
                      </button>
                    ) : (
                      <a
                        href="/pizza/login"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                      >
                        Giriş Gerekli
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/pizza/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-200"
            >
              Tüm Menüyü Gör
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Hemen Sipariş Ver!</h2>
          <p className="text-xl text-red-100 mb-8">En sevdiğin pizzayı 30 dakikada kapında</p>
          {user ? (
            <a
              href="/pizza/menu"
              className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Sipariş Ver
            </a>
          ) : (
            <a
              href="/pizza/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Hesap Oluştur ve Sipariş Ver
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold">Pizza Palace</span>
            <span className="bg-blue-600 px-2 py-1 rounded text-sm">Cache-Breaking V2</span>
          </div>
          <p className="text-gray-400">© 2024 Pizza Palace. Tüm hakları saklıdır.</p>
          <p className="text-gray-500 text-sm mt-2">En taze pizzalar, en hızlı teslimat!</p>
        </div>
      </footer>
    </div>
  );
}
