import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: `Thank you for your order. ${SITE_NAME} will send a confirmation email shortly.`,
  robots: { index: false, follow: true },
}

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
