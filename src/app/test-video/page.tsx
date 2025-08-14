'use client';

export default function TestVideoPage() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Tam ekran video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-screen object-cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        controls
      >
        <source src="/pizzaanasayfa.mp4" type="video/mp4" />
        Video desteklenmiyor.
      </video>

      {/* Overlay bilgi */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded">
        <h1 className="text-xl mb-2">Video Test Sayfası</h1>
        <p className="text-sm">Video tam ekranı kaplıyor mu kontrol edin.</p>
        <a
          href="/pizza"
          className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
        >
          Pizza sayfasına dön
        </a>
      </div>
    </div>
  );
}
