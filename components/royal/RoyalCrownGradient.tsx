'use client';

import React from 'react';

export default function RoyalCrownGradient() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {/* Dark royal gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #0b1020 0%, #0f172a 60%, #111827 100%)',
        }}
      />
      {/* Subtle repeating crowns via CSS masks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            `radial-gradient(circle at 8px 8px, rgba(255,255,255,0.6) 1px, rgba(255,255,255,0) 2px),
             radial-gradient(circle at 28px 18px, rgba(255,255,255,0.5) 1px, rgba(255,255,255,0) 2px)`,
          backgroundSize: '48px 48px, 48px 48px',
          backgroundPosition: '0 0, 0 0',
          filter: 'blur(0.2px)',
        }}
      />
    </div>
  );
}




