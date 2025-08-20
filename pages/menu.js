import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function MenuPage() {
  const products = [
    { id: '1', name: 'Margherita', description: 'Mozzarella, domates, fesleğen', price: 45, image: '/pizzas/margherita.png', category: 'pizzas', rating: 4.8, reviewCount: 124, isPopular: true, isVegetarian: true },
    { id: '2', name: 'Pepperoni', description: 'Pepperoni, mozzarella, domates', price: 55, image: '/pizzas/pepperoni.png', category: 'pizzas', rating: 4.7, reviewCount: 98, isPopular: true },
    { id: '3', name: 'Supreme', description: 'Sosis, mantar, biber', price: 65, image: '/pizzas/supreme.png', category: 'pizzas', rating: 4.9, reviewCount: 156 },
  ];

  const addToCart = () => {};
  const addToFavorites = () => {};
  const quickView = () => {};

  return (
    <>
      <Head>
        <title>Menü - Pizza Palace Pro</title>
      </Head>
      <Navigation />
      <main className="min-h-screen pt-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Menü</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onQuickView={quickView} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


