/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      perspective: {
        '1000': '1000px',
        '1400': '1400px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      transitionTimingFunction: {
        'card-flip': 'cubic-bezier(.2,.9,.3,1)',
      },
      willChange: {
        'transform': 'transform',
      },
      transitionDuration: {
        '850': '850ms',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      textShadow: {
        'sm': '0 1px 0 rgba(0,0,0,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shine': 'shine 4s ease-in-out infinite',
        'float': 'float 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shine: {
          '0%': { transform: 'translateX(-150%) translateY(-150%) rotate(30deg)' },
          '100%': { transform: 'translateX(150%) translateY(150%) rotate(30deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
} 