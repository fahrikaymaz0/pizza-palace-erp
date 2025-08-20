import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const STORES = [
  { city: 'İstanbul', address: 'Levent', phone: '0212 555 0199' },
  { city: 'Ankara', address: 'Çankaya', phone: '0312 555 0199' },
  { city: 'İzmir', address: 'Alsancak', phone: '0232 555 0199' },
];

export default function StoresPage() {
  return (
    <>
      <Head>
        <title>Şubeler - Pizza Palace Pro</title>
      </Head>
      <Navigation />
      <main className="min-h-screen pt-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Şubeler</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {STORES.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow border">
                <div className="text-sm text-gray-500">{s.city}</div>
                <div className="text-lg font-bold">{s.address}</div>
                <div className="text-gray-600">{s.phone}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


