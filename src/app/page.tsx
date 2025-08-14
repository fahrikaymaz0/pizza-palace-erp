'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Ana sayfaya gelen kullanıcıyı pizza web sitesine yönlendir
    router.push('/pizza');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white text-sm">🍕</span>
          </div>
          <p className="mt-4 text-gray-600">
            Pizza Palace&apos;a yönlendiriliyor...
          </p>
        </div>
      </div>
    </div>
  );
}
