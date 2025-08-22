import { useEffect, useState } from 'react';
import Head from 'next/head';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <>
      <Head><title>Profilim - Pizza Krallığı</title></Head>
      <div className="min-h-screen relative">
        <RoyalParallaxScene disableContentParallax />
        <div className="relative z-10 min-h-[70vh] flex items-center justify-center p-4">
          <div className="bg-black/40 border border-red-700/40 rounded-2xl p-8 w-full max-w-xl text-white">
            <h1 className="text-2xl font-bold mb-4">Profilim</h1>
            {user ? (
              <div className="space-y-2">
                <div><span className="text-gray-300">Ad:</span> {user.firstName} {user.lastName}</div>
                <div><span className="text-gray-300">E-posta:</span> {user.email}</div>
              </div>
            ) : (
              <p>Giriş yapılmamış.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



