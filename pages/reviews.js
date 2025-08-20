import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Ahmet Yılmaz', rating: 5, text: 'Mükemmel hız ve lezzet. Her zaman sıcak geliyor!' },
  { name: 'Ayşe Demir', rating: 5, text: 'Sosları harika. Özellikle Margherita favorim.' },
  { name: 'Mehmet Kaya', rating: 4, text: 'Çok beğendik, teslimat da hızlıydı.' },
];

export default function ReviewsPage() {
  return (
    <>
      <Head>
        <title>Yorumlar - Pizza Palace Pro</title>
      </Head>
      <Navigation />
      <main className="min-h-screen pt-28">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Müşteri Yorumları</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-gray-900 text-white rounded-xl p-6">
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-white/80 mt-2 text-sm">{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


