'use client'

import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import type { ProductCardProduct } from '@/components/product-card'
import { useStoreProducts } from '@/hooks/use-store-products'
import { LoadingScreen } from '@/components/loading-screen'

function toCardProduct(p: {
  id: string
  name: string
  category: string
  price: number
  status: string
  new_arrival?: boolean
  image_urls?: string[]
  discount_percent?: number | null
}): ProductCardProduct {
  const discount = p.discount_percent != null && p.discount_percent > 0 && p.discount_percent < 100
    ? p.discount_percent
    : 0
  const originalPrice =
    discount > 0 && p.price > 0
      ? Math.round(p.price / (1 - discount / 100))
      : undefined
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice,
    imageUrl: p.image_urls?.[0],
    isNew: p.new_arrival === true,
    soldOut: p.status === 'Out of Stock',
  }
}

export const FeaturedProducts = () => {
  const { products, loading, error } = useStoreProducts()
  const newArrivals = products.filter((p) => p.new_arrival === true).slice(0, 8)
  const cardProducts = newArrivals.map(toCardProduct)

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="font-serif text-foreground/60 text-xs sm:text-sm uppercase tracking-[0.2em] mb-1.5 sm:mb-2">
            Bixlay
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary uppercase tracking-tight">
            New Arrivals
          </h2>
        </div>

        {loading ? (
          <LoadingScreen variant="productGrid" className="py-4" />
        ) : error ? (
          <p className="text-center py-12 text-destructive text-sm">{error}</p>
        ) : cardProducts.length > 0 ? (
          <>
            {/* Mobile: slow infinite auto-scroll with small cards (two copies = seamless loop) */}
            <div className="sm:hidden -mx-4 overflow-hidden">
              <div
                className="flex gap-3 pb-2 w-max"
                style={{
                  width: 'max-content',
                  animation: 'var(--animate-new-arrivals-scroll)',
                }}
              >
                {[cardProducts, cardProducts].flat().map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {cardProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10 sm:mt-14">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm uppercase tracking-wide"
              >
                View all new arrivals
                <span>→</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No new arrivals yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm uppercase tracking-wide"
            >
              Shop all products
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
