import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Pizza Palace ERP - Ana Sayfa</title>
        <meta name="description" content="Modern pizza sipariş ve yönetim sistemi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">
              🍕 Pizza Palace ERP
            </h1>
            <p className="text-xl text-white mb-12">
              Modern pizza sipariş ve yönetim sistemi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Kullanıcı Bölümü */}
              <div className="bg-white bg-opacity-20 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-white mb-4">👥 Müşteriler</h2>
                <p className="text-white mb-6">Pizza siparişi verin, kayıt olun</p>
                
                <div className="space-y-4">
                  <Link href="/pizza" className="block">
                    <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                      🍕 Pizza Menü
                    </div>
                  </Link>
                  
                  <Link href="/register" className="block">
                    <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                      📝 Kayıt Ol
                    </div>
                  </Link>
                  
                  <Link href="/login" className="block">
                    <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                      🔐 Giriş Yap
                    </div>
                  </Link>
                </div>
              </div>

              {/* Admin Bölümü */}
              <div className="bg-white bg-opacity-20 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-white mb-4">👨‍💼 Yöneticiler</h2>
                <p className="text-white mb-6">Siparişleri yönetin, raporları görün</p>
                
                <div className="space-y-4">
                  <Link href="/admin/login" className="block">
                    <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                      🔐 Admin Girişi
                    </div>
                  </Link>
                  
                  <Link href="/admin-test" className="block">
                    <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                      🧪 Admin Test
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-4">Sistem Bilgileri:</h3>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg inline-block">
                <p className="text-white text-sm">
                  <strong>Frontend:</strong> Vercel'de yayınlı (https://pizza-palace-erp-qc8j.vercel.app/)
                </p>
                <p className="text-white text-sm">
                  <strong>Backend:</strong> Localhost'ta çalışıyor (http://localhost:3001/api)
                </p>
                <p className="text-white text-sm">
                  <strong>Veriler:</strong> Localhost'ta güvenli şekilde saklanıyor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 