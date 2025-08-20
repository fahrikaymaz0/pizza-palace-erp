'use client';

export default function ProfessionalDrippingCheese() {
  const drips = Array.from({ length: 12 }, (_, i) => ({
    x: 60 + i * 100 + Math.random() * 40,
    delay: i * 0.6 + Math.random() * 3,
    duration: 10 + Math.random() * 6,
    height: 150 + Math.random() * 120,
    width: 12 + Math.random() * 8,
    thickness: 6 + Math.random() * 4
  }));

  return (
    <div className="fixed inset-x-0 top-0 h-screen overflow-hidden pointer-events-none z-10">
      {/* Üst peynir tabakası - daha organik ve yumuşak */}
      <div 
        className="absolute top-0 w-full h-20 z-20"
        style={{
          background: 'linear-gradient(180deg, #FFFDE7 0%, #FFF59D 20%, #FFCC02 40%, #FF8F00 60%, #E65100 80%, #BF360C 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 98% 65%, 95% 60%, 92% 70%, 88% 55%, 85% 75%, 80% 50%, 75% 80%, 70% 45%, 65% 85%, 60% 40%, 55% 90%, 50% 35%, 45% 85%, 40% 45%, 35% 80%, 30% 50%, 25% 75%, 20% 55%, 15% 70%, 10% 60%, 5% 65%, 0 60%)',
          boxShadow: '0 12px 24px rgba(191, 54, 12, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Ana akan damlalar - daha organik şekiller */}
      {drips.map((drip, index) => (
        <div key={index} className="absolute top-20" style={{ left: `${drip.x}px` }}>
          {/* Ana damla gövdesi - yumuşak ve organik */}
          <div
            className="relative"
            style={{
              width: `${drip.width}px`,
              height: `${drip.height}px`,
              background: 'linear-gradient(180deg, #FFFDE7 0%, #FFF59D 10%, #FFEB3B 25%, #FFC107 45%, #FF9800 65%, #FF6F00 85%, #E65100 100%)',
              borderRadius: `${drip.width * 0.8}px ${drip.width * 0.8}px ${drip.width * 1.5}px ${drip.width * 1.5}px`,
              animation: `organicDrip ${drip.duration}s ease-out ${drip.delay}s infinite`,
              transformOrigin: 'top center',
              boxShadow: `inset -1px 0 3px rgba(0,0,0,0.1), inset 1px 0 3px rgba(255,255,255,0.3), 3px 6px 12px rgba(191, 54, 12, 0.3)`,
              filter: 'blur(0.3px)',
              position: 'relative'
            }}
          >
            {/* İç highlight - daha yumuşak */}
            <div
              className="absolute top-1 left-1"
              style={{
                width: `${drip.width * 0.4}px`,
                height: `${drip.height * 0.7}px`,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,248,220,0.6) 30%, rgba(255,235,59,0.3) 60%, transparent 100%)',
                borderRadius: `${drip.width * 0.2}px`,
                animation: `organicDrip ${drip.duration}s ease-out ${drip.delay}s infinite`,
                filter: 'blur(0.2px)'
              }}
            />
            
            {/* Alt damla ucu - daha yumuşak ve organik */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: `${drip.width * 2.2}px`,
                height: `${drip.width * 2.8}px`,
                background: 'radial-gradient(ellipse at 35% 35%, #FFF59D, #FFCC02, #FF8F00, #E65100)',
                borderRadius: '60% 60% 40% 40% / 70% 70% 30% 30%',
                animation: `organicDrop ${drip.duration}s ease-out ${drip.delay}s infinite`,
                boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3), 0 4px 8px rgba(191, 54, 12, 0.4)`,
                filter: 'blur(0.4px)'
              }}
            />

            {/* Ekstra yumuşaklık için gölge efekti */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: `${drip.width * 2.5}px`,
                height: `${drip.width * 1.5}px`,
                background: 'radial-gradient(ellipse, rgba(191, 54, 12, 0.2), transparent)',
                borderRadius: '50%',
                animation: `organicDrop ${drip.duration}s ease-out ${drip.delay}s infinite`,
                filter: 'blur(1px)'
              }}
            />
          </div>

          {/* Kopan küçük damlalar - daha yumuşak */}
          {Array.from({ length: 3 }, (_, dropIndex) => (
            <div
              key={`drop-${index}-${dropIndex}`}
              className="absolute"
              style={{
                width: `${4 + Math.random() * 3}px`,
                height: `${4 + Math.random() * 3}px`,
                background: 'radial-gradient(circle, #FFEB3B, #FF9800, #E65100)',
                borderRadius: '50%',
                left: `${drip.width/2 - 2 + Math.random() * 4}px`,
                top: `${drip.height * 0.7 + dropIndex * 20}px`,
                animation: `softFall ${drip.duration * 0.8}s linear ${drip.delay + drip.duration * 0.6 + dropIndex * 0.2}s infinite`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                filter: 'blur(0.2px)'
              }}
            />
          ))}
        </div>
      ))}

      {/* Ekstra sıçrayan damlalar - daha organik */}
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={`splash-${i}`}
          className="absolute top-20"
          style={{
            left: `${40 + i * 80 + Math.random() * 60}px`,
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            background: 'radial-gradient(circle, #FFF176, #FFCC02, #FF8F00)',
            borderRadius: '50%',
            animation: `organicSplash ${4 + Math.random() * 3}s linear ${i * 0.4 + 2}s infinite`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            filter: 'blur(0.3px)'
          }}
        />
      ))}

      {/* Ekstra yumuşaklık için arka plan efekti */}
      <div
        className="absolute top-0 w-full h-screen"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255, 193, 7, 0.05) 0%, transparent 70%)',
          animation: 'softGlow 8s ease-in-out infinite'
        }}
      />

      <style jsx>{`
        @keyframes organicDrip {
          0% {
            transform: scaleY(0) scaleX(0.8);
            opacity: 0;
          }
          20% {
            transform: scaleY(0.3) scaleX(0.9);
            opacity: 0.6;
          }
          40% {
            transform: scaleY(0.6) scaleX(1);
            opacity: 0.9;
          }
          60% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 1;
          }
          80% {
            transform: scaleY(1.1) scaleX(1);
            opacity: 0.8;
          }
          100% {
            transform: scaleY(0) scaleX(0.8);
            opacity: 0;
          }
        }

        @keyframes organicDrop {
          0% {
            transform: translateX(-50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            transform: translateX(-50%) scale(0.4) rotate(5deg);
            opacity: 0.6;
          }
          60% {
            transform: translateX(-50%) scale(1.1) rotate(-3deg);
            opacity: 1;
          }
          80% {
            transform: translateX(-50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) scale(0) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes softFall {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes organicSplash {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.7;
          }
          30% {
            transform: translateY(40px) translateX(8px) scale(1.2);
            opacity: 0.9;
          }
          70% {
            transform: translateY(80px) translateX(-5px) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) translateX(-10px) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes softGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}


