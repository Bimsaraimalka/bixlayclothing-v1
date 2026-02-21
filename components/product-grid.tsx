'use client'

import { useMemo, type ReactNode } from 'react'
import { ProductCard } from '@/components/product-card'
import type { ProductCardProduct } from '@/components/product-card'
import { useStoreProducts } from '@/hooks/use-store-products'
import { useSearchParams } from 'next/navigation'
import type { ProductSegment } from '@/lib/admin-data'
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

function matchesPrice(price: number, priceParam: string): boolean {
  if (!priceParam) return true
  if (priceParam === '0-2500') return price >= 0 && price <= 2500
  if (priceParam === '2500-5000') return price >= 2500 && price <= 5000
  if (priceParam === '5000-10000') return price >= 5000 && price <= 10000
  if (priceParam === '10000+') return price >= 10000
  return true
}

type ProductGridProps = {
  /** When set, show only products for this audience (Men + Unisex or Women + Unisex). */
  segment?: ProductSegment
  /** When true, show only products marked as New Arrivals. */
  newArrivalOnly?: boolean
  /** Optional slot for filter button (mobile) - rendered in header row */
  filterButton?: ReactNode
}

export function ProductGrid({ segment, newArrivalOnly, filterButton }: ProductGridProps = {}) {
  const { products, loading, error } = useStoreProducts()
  const searchParams = useSearchParams()

  const categoryParam = searchParams.get('category') ?? ''
  const priceParam = searchParams.get('price') ?? ''
  const sizeParam = searchParams.get('size') ?? ''
  const colorParam = searchParams.get('color') ?? ''

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (newArrivalOnly && !p.new_arrival) return false
      if (segment === 'Men' && p.segment !== 'Men' && p.segment !== 'Unisex') return false
      if (segment === 'Women' && p.segment !== 'Women' && p.segment !== 'Unisex') return false
      if (segment === 'Unisex' && p.segment !== 'Unisex') return false
      if (categoryParam && p.category !== categoryParam) return false
      if (priceParam && !matchesPrice(Number(p.price), priceParam)) return false
      if (sizeParam && !(p.sizes ?? []).includes(sizeParam)) return false
      if (colorParam && !(p.colors ?? []).map((c) => c.trim()).includes(colorParam)) return false
      return true
    })
  }, [products, newArrivalOnly, segment, categoryParam, priceParam, sizeParam, colorParam])

  const cardProducts = filtered.map(toCardProduct)

  if (loading) {
    return <LoadingScreen variant="productGrid" />
  }
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {filterButton}
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing {cardProducts.length} products
          </p>
        </div>
        <select className="min-h-[44px] px-3 sm:px-4 py-2 pr-8 sm:pr-10 border border-border rounded-lg bg-background text-foreground text-base sm:text-sm w-full sm:w-auto touch-manipulation">
          <option>Sort: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Best Sellers</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cardProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {cardProducts.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">No products yet.</p>
      )}
    </div>
  )
}
