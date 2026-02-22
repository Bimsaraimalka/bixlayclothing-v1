import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Log in',
  description: `Sign in to your ${SITE_NAME} account to manage orders and preferences.`,
  robots: { index: false, follow: true },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
