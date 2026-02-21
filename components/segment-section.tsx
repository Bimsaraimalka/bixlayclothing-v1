'use client'

import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import type { ProductCardProduct } from '@/components/product-card'
import { useStoreProducts } from '@/hooks/use-store-products'
import { LoadingScreen } from '@/components/loading-screen'
import type { ProductSegment } from '@/lib/admin-data'

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

function filterBySegment(products: { segment?: ProductSegment }[], segment: ProductSegment) {
  if (segment === 'Men') {
    return products.filter((p) => p.segment === 'Men' || p.segment === 'Unisex')
  }
  if (segment === 'Women') {
    return products.filter((p) => p.segment === 'Women' || p.segment === 'Unisex')
  }
  return products
}

type SegmentSectionProps = {
  segment: 'Men' | 'Women'
  href: string
  bgClass?: string
}

export function SegmentSection({ segment, href, bgClass = 'bg-secondary/30' }: SegmentSectionProps) {
  const { products, loading, error } = useStoreProducts()
  const filtered = filterBySegment(products, segment).slice(0, 6)
  const cardProducts = filtered.map(toCardProduct)
  return (
    <section className={`w-full py-12 sm:py-16 lg:py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary uppercase tracking-tight">
            {segment}
          </h2>
          <Link
            href={href}
            className="text-sm font-medium text-primary hover:underline uppercase tracking-wide"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <LoadingScreen variant="productGrid" className="py-4" />
        ) : error ? (
          <p className="text-center py-12 text-destructive text-sm">{error}</p>
        ) : cardProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {cardProducts.map((product) => (
              <ProductCard key={product.id} product={product} size="compact" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No {segment.toLowerCase()} products yet.</p>
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm uppercase tracking-wide"
            >
              Shop all
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
