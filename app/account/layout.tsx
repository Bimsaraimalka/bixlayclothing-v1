import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'My account',
  description: `Manage your ${SITE_NAME} account, profile, and orders.`,
  robots: { index: false, follow: true },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
