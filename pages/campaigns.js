import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import FlashDeal from '../components/FlashDeal';

export default function CampaignsPage() {
  return (
    <>
      <Head>
        <title>Kampanyalar - Pizza Palace Pro</title>
      </Head>
      <Navigation />
      <main className="min-h-screen pt-28">
        <FlashDeal className="pt-0" />
      </main>
      <Footer />
    </>
  );
}


