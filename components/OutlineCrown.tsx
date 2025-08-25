'use client';

import React from 'react';

interface OutlineCrownProps {
  className?: string;
}

// Çizgili, içi boş taç (outline). Unicode benzeri minimalist SVG.
export default function OutlineCrown({ className = 'w-8 h-8 text-yellow-600' }: OutlineCrownProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18h18"/>
      <path d="M5 18l2-9 5 5 5-5 2 9"/>
      <circle cx="7" cy="7" r="1"/>
      <circle cx="12" cy="6" r="1"/>
      <circle cx="17" cy="7" r="1"/>
    </svg>
  );
}



