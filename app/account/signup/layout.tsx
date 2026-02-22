import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sign up',
  description: `Create your ${SITE_NAME} account for faster checkout and order tracking.`,
  robots: { index: false, follow: true },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
