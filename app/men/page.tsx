import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductFiltersLayout } from '@/components/product-filters-layout'
import { Suspense } from 'react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Men',
  description: 'Premium clothing for men – refined styles, quality fabrics. Shop shirts, pants, and essentials.',
  openGraph: { title: 'Men | ' + SITE_NAME, description: 'Premium clothing for men.' },
}

export default function MenPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Men
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Premium clothing for men
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Suspense fallback={<div className="animate-pulse space-y-4" />}>
            <ProductFiltersLayout segment="Men" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
