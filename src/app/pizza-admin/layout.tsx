import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pizza Palace Admin - Sipariş Yönetimi',
  description: 'Pizza Palace Admin Panel - Sipariş yönetimi ve kontrol',
}

export default function PizzaAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}



