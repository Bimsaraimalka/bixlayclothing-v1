import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProviderWithDrawer } from '@/components/cart-provider-with-drawer'
import { CustomerAuthProvider } from '@/components/customer-auth-context'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '600', '700']
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Bixlay - Premium Clothing',
  description: 'Bixlay is a premium clothing company. Discover refined, high-quality apparel for every occasion.',
  generator: 'v0.app',
  keywords: 'clothing, fashion, premium, apparel, luxury, Bixlay',
  openGraph: {
    title: 'Bixlay - Premium Clothing',
    description: 'Premium clothing company. Refined, high-quality apparel for every occasion.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen overflow-x-hidden">
        <CustomerAuthProvider>
          <CartProviderWithDrawer>
            {children}
          </CartProviderWithDrawer>
        </CustomerAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
