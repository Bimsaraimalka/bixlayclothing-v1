import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilter } from '@/components/product-filter'
import { Suspense } from 'react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Our Collection',
  description: 'Browse the complete Bixlay collection – premium clothing for men and women. Quality fabrics, timeless styles.',
  openGraph: { title: 'Our Collection | ' + SITE_NAME, description: 'Browse premium clothing for men and women.' },
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Our Collection
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Browse our complete selection of premium clothing
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Suspense fallback={<div className="animate-pulse space-y-4" />}>
                <ProductFilter />
              </Suspense>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="animate-pulse space-y-4" />}>
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
