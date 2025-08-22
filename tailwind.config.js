/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#fef7e0',
          100: '#fdecc1',
          200: '#fbd583',
          300: '#f9be45',
          400: '#f7a717',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        purple: {
          900: '#581c87',
          800: '#6b21a8',
          700: '#7c3aed',
          600: '#9333ea',
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
          200: '#e9d5ff',
          100: '#f3e8ff',
          50: '#faf5ff',
        },
        red: {
          900: '#7f1d1d',
          800: '#991b1b',
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
          300: '#fca5a5',
          200: '#fecaca',
          100: '#fee2e2',
          50: '#fef2f2',
        }
      },
      fontFamily: {
        'royal': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
        'crown-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 5L35 20L50 25L40 35L42 50L30 45L18 50L20 35L10 25L25 20L30 5Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'royal-float': 'royal-float 6s ease-in-out infinite',
        'royal-pulse': 'royal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'royal-bounce': 'royal-bounce 1s infinite',
        'royal-spin': 'royal-spin 1s linear infinite',
        'royal-ping': 'royal-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'royal-wiggle': 'royal-wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        'royal-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'royal-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'royal-bounce': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        'royal-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'royal-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        'royal-wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      boxShadow: {
        'royal': '0 10px 25px -5px rgba(220, 38, 38, 0.1), 0 10px 10px -5px rgba(220, 38, 38, 0.04)',
        'royal-lg': '0 20px 25px -5px rgba(220, 38, 38, 0.1), 0 10px 10px -5px rgba(220, 38, 38, 0.04)',
        'royal-xl': '0 25px 50px -12px rgba(220, 38, 38, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
