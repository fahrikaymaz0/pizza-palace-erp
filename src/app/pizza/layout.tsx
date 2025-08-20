import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pizza Palace - Lezzetin Adresi',
  description: 'Pizza Palace - En lezzetli pizzalar, hızlı teslimat',
};

export default function PizzaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}




