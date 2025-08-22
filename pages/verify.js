import { useState } from 'react';
import Head from 'next/head';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

export default function Verify() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Doğrulama başarılı. Giriş yapıldı.');
        window.location.href = '/';
      } else {
        setMessage(data.message || 'Doğrulama başarısız');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>E-posta Doğrulama - Pizza Krallığı</title>
      </Head>
      <div className="min-h-screen relative">
        <RoyalParallaxScene disableContentParallax />
        <div className="relative z-10 min-h-[80vh] flex items-center justify-center p-4">
          <form onSubmit={submit} className="bg-black/40 border border-red-700/40 rounded-2xl p-8 w-full max-w-md text-white space-y-4">
            <h1 className="text-2xl font-bold mb-2 text-center">E-posta Doğrulama</h1>
            <input className="w-full px-4 py-3 bg-white/10 border border-red-700/40 rounded-lg" placeholder="E-posta" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="w-full px-4 py-3 bg-white/10 border border-red-700/40 rounded-lg" placeholder="Onay Kodu" value={code} onChange={(e)=>setCode(e.target.value)} />
            <button disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-bold">{loading? 'Gönderiliyor...':'Doğrula ve Giriş Yap'}</button>
            {message && <p className="text-center text-sm text-gray-200">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}



