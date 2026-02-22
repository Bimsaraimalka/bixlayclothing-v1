import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilter } from '@/components/product-filter'
import { Suspense } from 'react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Latest Bixlay arrivals – fresh styles and new pieces. Be first to shop new drops.',
  openGraph: { title: 'New Arrivals | ' + SITE_NAME, description: 'Fresh styles just landed.' },
}

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              New Arrivals
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Fresh styles just landed
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <aside className="lg:col-span-1">
              <Suspense fallback={<div className="animate-pulse space-y-4" />}>
                <ProductFilter />
              </Suspense>
            </aside>

            <div className="lg:col-span-3">
              <Suspense fallback={<div className="animate-pulse space-y-4" />}>
                <ProductGrid newArrivalOnly />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
