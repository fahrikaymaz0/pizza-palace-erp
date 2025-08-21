import '../styles/globals.css'
import dynamic from 'next/dynamic'

const RoyalCrownGradient = dynamic(() => import('../components/royal/RoyalCrownGradient'), { ssr: false })

export default function App({ Component, pageProps }) {
  return (
    <>
      <RoyalCrownGradient />
      <Component {...pageProps} />
    </>
  )
}