'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string;
}

export default function PizzaHomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    loadMenu();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/v2/auth/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await fetch('/api/v2/pizza/menu');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMenuItems(data.data);
        }
      }
    } catch (error) {
      console.error('Menu load error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Neden Pizza Krallığı?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-xl font-bold mb-2">Taze Malzemeler</h3>
              <p className="text-gray-600">Her gün taze malzemelerle hazırlanan pizzalar</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">30 dakika içinde kapınızda</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Kaliteli Hizmet</h3>
              <p className="text-gray-600">Müşteri memnuniyeti odaklı hizmet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Popüler Pizzalarımız
          </h2>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Menü yükleniyor...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🍕</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">₺{item.price}</span>
                      <Link
                        href="/pizza/menu"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sipariş Ver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              href="/pizza/menu"
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Tüm Menüyü Gör
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Hemen Sipariş Verin!
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Lezzetli pizzalarımızı denemek için hemen başlayın
          </p>
          
          <div className="space-x-4">
            {user ? (
              <Link
                href="/pizza/menu"
                className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Menüye Git
              </Link>
            ) : (
              <>
                <Link
                  href="/pizza/login"
                  className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/pizza/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
