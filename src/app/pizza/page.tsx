'use client';

import HeroSection from '@/components/HeroSection';

export default function PizzaHomePage() {
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
              <p className="text-gray-600">
                Her gün taze malzemelerle hazırlanan pizzalar
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">30 dakika içinde kapınızda</p>
            </div>

            <div className="text-center p-6">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold mb-2">Uzman Şefler</h3>
              <p className="text-gray-600">
                İtalyan mutfağında uzmanlaşmış şeflerimiz
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
