'use client';

import React from 'react';

interface RoyalCrownProps {
  className?: string;
}

// Kullanıcının sağladığı path ile kırmızı çizgisel taç simgesi
export default function RoyalCrown({ className = 'w-6 h-6 text-yellow-600' }: RoyalCrownProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
    </svg>
  );
}


