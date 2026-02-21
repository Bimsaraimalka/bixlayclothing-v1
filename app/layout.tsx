import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProviderWithDrawer } from '@/components/cart-provider-with-drawer'
import { CustomerAuthProvider } from '@/components/customer-auth-context'
import { BASE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: BASE_URL ? new URL(BASE_URL) : undefined,
  title: {
    default: `${SITE_NAME} – Premium Clothing`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['clothing', 'fashion', 'premium', 'apparel', 'luxury', 'Bixlay', 'Sri Lanka', 'men', 'women', 'new arrivals'],
  authors: [{ name: SITE_NAME, url: BASE_URL ?? '/' }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Premium Clothing`,
    description: SITE_DESCRIPTION,
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME },
      { url: '/icon.svg', type: 'image/svg+xml', alt: SITE_NAME },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – Premium Clothing`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: { canonical: BASE_URL ?? '/' },
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
