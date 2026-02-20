'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export type ProductCardProduct = {
  id: string
  name: string
  category: string
  price?: number
  priceMin?: number
  priceMax?: number
  /** When set, show original price crossed out and current price (e.g. was 4500, now 3000) */
  originalPrice?: number
  isNew?: boolean
  soldOut?: boolean
  topSelling?: boolean
}

type ProductCardProps = {
  product: ProductCardProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const hasSinglePrice = 'price' in product && product.price != null
  const showBeforeNow =
    hasSinglePrice &&
    product.originalPrice != null &&
    product.originalPrice > (product.price ?? 0)
  const priceLabel = hasSinglePrice
    ? formatPrice(product.price!)
    : formatPrice(product.priceMin!)

  return (
    <div className="group bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`} className="block">
        {/* Image area with badges */}
        <div className="relative aspect-square bg-muted">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Image
          </div>
          {product.isNew && (
            <span className="absolute top-4 left-4 flex h-8 min-w-[2rem] items-center justify-center rounded-[10px] bg-primary text-primary-foreground text-xs font-medium uppercase px-2.5 py-1.5">
              New
            </span>
          )}
          {product.soldOut && (
            <span className="absolute top-4 left-[4.5rem] flex h-8 min-w-[4.5rem] items-center justify-center rounded-[10px] bg-primary text-primary-foreground text-xs font-medium uppercase px-3 py-1.5">
              Sold out
            </span>
          )}
          {product.topSelling && (
            <span className="absolute top-4 right-4 flex h-8 min-w-[4.5rem] items-center justify-center rounded-[10px] bg-accent text-white text-xs font-medium uppercase px-3 py-1.5">
              Top Selling
            </span>
          )}
        </div>

        {/* Product info */}
        <div className="p-3 sm:p-4 space-y-0.5 sm:space-y-1">
          <h3 className="font-sans font-medium text-foreground text-sm sm:text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product.category}
          </p>
          <p className="font-sans font-bold text-foreground text-xs sm:text-sm pt-0.5 sm:pt-1">
            {showBeforeNow ? (
              <>
                <span className="line-through text-muted-foreground font-normal mr-1.5">
                  {formatPrice(product.originalPrice!)}
                </span>
                {formatPrice(product.price!)}
              </>
            ) : (
              priceLabel
            )}
          </p>
        </div>
      </Link>
    </div>
  )
}
