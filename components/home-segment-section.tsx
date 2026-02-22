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

const SEGMENT_CONFIG: Record<ProductSegment, { title: string; href: string; linkText: string }> = {
  Men: { title: "Men's", href: '/men', linkText: "Shop Men's" },
  Women: { title: "Women's", href: '/women', linkText: "Shop Women's" },
  Unisex: { title: 'Unisex', href: '/products', linkText: 'Shop all' },
}

type HomeSegmentSectionProps = {
  segment: 'Men' | 'Women'
  /** Optional alternate background (e.g. bg-secondary) */
  className?: string
}

export function HomeSegmentSection({ segment, className = '' }: HomeSegmentSectionProps) {
  const { products, loading, error } = useStoreProducts()
  const config = SEGMENT_CONFIG[segment]
  const filtered =
    segment === 'Men'
      ? products.filter((p) => p.segment === 'Men' || p.segment === 'Unisex')
      : products.filter((p) => p.segment === 'Women' || p.segment === 'Unisex')
  const displayProducts = filtered.slice(0, 8)
  const cardProducts = displayProducts.map(toCardProduct)

  return (
    <section className={`w-full py-10 sm:py-16 lg:py-20 ${className || 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <p className="font-serif text-foreground/60 text-xs sm:text-sm uppercase tracking-[0.2em] mb-1.5 sm:mb-2">
            Bixlay
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary uppercase tracking-tight">
            {config.title}
          </h2>
        </div>

        {loading ? (
          <LoadingScreen variant="productGrid" className="py-4" />
        ) : error ? (
          <p className="text-center py-12 text-destructive text-xs sm:text-sm">{error}</p>
        ) : cardProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {cardProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-14">
              <Link
                href={config.href}
                className="inline-flex items-center justify-center gap-2 text-primary font-semibold hover:underline text-xs sm:text-sm uppercase tracking-wide min-h-[44px] px-5 py-3 touch-manipulation"
              >
                {config.linkText}
                <span>→</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base mb-4">No {config.title.toLowerCase()} products yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 text-primary font-semibold hover:underline text-xs sm:text-sm uppercase tracking-wide min-h-[44px] px-5 py-3 touch-manipulation"
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
