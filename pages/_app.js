import '../styles/globals.css'
import Head from 'next/head'
import { ThemeProvider } from '../context/DarkModeContext'
import dynamic from 'next/dynamic'

// Lazy load components for better performance
const Footer = dynamic(() => import('../components/Footer'), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />
})
const RoyalCrownGradient = dynamic(() => import('../components/royal/RoyalCrownGradient'), { 
  ssr: false,
  loading: () => null
})

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* Critical CSS for faster loading */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
              background-size: 400% 100%;
              animation: skeleton-loading 1.4s ease infinite;
            }
            @keyframes skeleton-loading {
              0% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .fade-in {
              animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            /* Critical above-the-fold styles */
            body { margin: 0; padding: 0; background: #ffffff; }
            .hero-skeleton { min-height: 100vh; background: #ffffff; }
          `
        }} />
        
        {/* Progressive Web App meta - Updated for modern standards */}
        <meta name="theme-color" content="#DC2626" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pizza Krallığı" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Performance hints - Removed problematic preloads */}
        <link rel="prefetch" href="/api/products" />
      </Head>
      <RoyalCrownGradient />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  )
}