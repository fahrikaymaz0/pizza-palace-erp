'use client';

export default function ProfessionalDrippingCheese() {
  const drips = Array.from({ length: 15 }, (_, i) => ({
    x: 80 + i * 80,
    delay: i * 0.4 + Math.random() * 2,
    duration: 8 + Math.random() * 4,
    height: 120 + Math.random() * 100,
    thickness: 8 + Math.random() * 6
  }));

  return (
    <div className="fixed inset-x-0 top-0 h-screen overflow-hidden pointer-events-none z-10">
      {/* Üst peynir tabakası */}
      <div 
        className="absolute top-0 w-full h-16 z-20"
        style={{
          background: 'linear-gradient(180deg, #FFFDE7 0%, #FFF59D 25%, #FFCC02 50%, #FF8F00 75%, #E65100 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 80%, 90% 75%, 85% 85%, 80% 75%, 75% 82%, 70% 72%, 65% 85%, 60% 75%, 55% 80%, 50% 70%, 45% 85%, 40% 72%, 35% 80%, 30% 75%, 25% 85%, 20% 70%, 15% 82%, 10% 75%, 5% 80%, 0 70%)',
          boxShadow: '0 8px 16px rgba(191, 54, 12, 0.3)'
        }}
      />

      {/* Akan damlalar */}
      {drips.map((drip, index) => (
        <div key={index} className="absolute top-16" style={{ left: `${drip.x}px` }}>
          {/* Ana damla gövdesi */}
          <div
            className="relative"
            style={{
              width: `${drip.thickness}px`,
              height: `${drip.height}px`,
              background: 'linear-gradient(180deg, #FFFDE7 0%, #FFF176 15%, #FFEB3B 30%, #FFC107 50%, #FF9800 70%, #FF6F00 85%, #E65100 100%)',
              borderRadius: `${drip.thickness/2}px ${drip.thickness/2}px ${drip.thickness * 2}px ${drip.thickness * 2}px`,
              animation: `dripGrow ${drip.duration}s ease-out ${drip.delay}s infinite`,
              transformOrigin: 'top center',
              boxShadow: `inset -2px 0 4px rgba(0,0,0,0.1), 2px 4px 8px rgba(191, 54, 12, 0.2)`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            {/* Highlight efekti */}
            <div
              className="absolute top-2 left-1"
              style={{
                width: `${drip.thickness * 0.3}px`,
                height: `${drip.height * 0.6}px`,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,248,220,0.4) 50%, transparent 100%)',
                borderRadius: `${drip.thickness * 0.15}px`,
                animation: `dripGrow ${drip.duration}s ease-out ${drip.delay}s infinite`,
              }}
            />
            
            {/* Alt damla ucu */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: `${drip.thickness * 1.8}px`,
                height: `${drip.thickness * 1.8}px`,
                background: 'radial-gradient(circle at 30% 30%, #FFF59D, #FFCC02, #FF8F00)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                animation: `dropForm ${drip.duration}s ease-out ${drip.delay}s infinite`,
                boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(191, 54, 12, 0.3)`
              }}
            />
          </div>

          {/* Kopan küçük damlalar */}
          <div
            className="absolute"
            style={{
              width: '6px',
              height: '6px',
              background: 'radial-gradient(circle, #FFEB3B, #FF9800)',
              borderRadius: '50%',
              left: `${drip.thickness/2 - 3}px`,
              animation: `fallDrop ${drip.duration * 0.6}s linear ${drip.delay + drip.duration * 0.7}s infinite`
            }}
          />
        </div>
      ))}

      {/* Ekstra sıçrayan damlalar */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`splash-${i}`}
          className="absolute top-16"
          style={{
            left: `${60 + i * 60}px`,
            width: '4px',
            height: '4px',
            background: 'radial-gradient(circle, #FFF176, #FFCC02)',
            borderRadius: '50%',
            animation: `splashDrop ${3 + Math.random() * 2}s linear ${i * 0.3 + 3}s infinite`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes dripGrow {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          25% {
            transform: scaleY(0.4);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(0.8);
            opacity: 1;
          }
          75% {
            transform: scaleY(1);
            opacity: 1;
          }
          90% {
            transform: scaleY(1.1);
            opacity: 0.9;
          }
          100% {
            transform: scaleY(0);
            opacity: 0;
          }
        }

        @keyframes dropForm {
          0% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateX(-50%) scale(0.5);
            opacity: 0.8;
          }
          75% {
            transform: translateX(-50%) scale(1.2);
            opacity: 1;
          }
          85% {
            transform: translateX(-50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
          }
        }

        @keyframes fallDrop {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes splashDrop {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
          20% {
            transform: translateY(30px) translateX(5px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(-3px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}


