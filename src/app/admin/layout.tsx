import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kaymaz Digital Solutions - Admin Panel',
  description: 'Enterprise Resource Planning System',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function AdminLayout({
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