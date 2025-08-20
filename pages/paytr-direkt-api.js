import dynamic from 'next/dynamic';

const PayTRDirektAPI = dynamic(() => import('../src/components/PayTRDirektAPI'), {
	ssr: false,
});

export default function PayTRPage() {
	return <PayTRDirektAPI />;
}


