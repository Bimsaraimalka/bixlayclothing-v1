import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { SITE_NAME, SITE_DESCRIPTION, BASE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: `${SITE_NAME} – Premium Clothing`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} – Premium Clothing`,
    description: SITE_DESCRIPTION,
  },
}

const siteUrl = BASE_URL ?? 'https://bixlay.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-US',
    },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
