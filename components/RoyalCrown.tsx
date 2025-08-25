'use client';

import React from 'react';

interface RoyalCrownProps {
  className?: string;
}

// Kırmızı dolu taç ve altında çizgi (gönderilen görsele benzer)
export default function RoyalCrown({ className = 'w-10 h-10' }: RoyalCrownProps) {
  return (
    <svg
      viewBox="0 0 128 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M10 18l18 20 18-18 18 18 18-18 18 20V72a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V18z"
          fill="#d71920"
        />
        <circle cx="28" cy="18" r="6" fill="#d71920"/>
        <circle cx="64" cy="14" r="6" fill="#d71920"/>
        <circle cx="100" cy="18" r="6" fill="#d71920"/>
        <rect x="24" y="78" width="80" height="10" rx="5" fill="#d71920"/>
      </g>
    </svg>
  );
}


