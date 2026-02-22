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
  /** First product image URL; when set, shown on the card instead of placeholder */
  imageUrl?: string
  isNew?: boolean
  soldOut?: boolean
  topSelling?: boolean
}

type ProductCardProps = {
  product: ProductCardProduct
  /** Compact layout for horizontal scroll / mobile strips */
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const hasSinglePrice = 'price' in product && product.price != null
  const showBeforeNow =
    hasSinglePrice &&
    product.originalPrice != null &&
    product.originalPrice > (product.price ?? 0)
  const discountPercent =
    showBeforeNow && product.originalPrice! > 0
      ? Math.round((1 - (product.price! / product.originalPrice!)) * 100)
      : 0
  const priceLabel = hasSinglePrice
    ? formatPrice(product.price!)
    : formatPrice(product.priceMin!)
  const isCompact = variant === 'compact'

  return (
    <div
      className={`group bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${isCompact ? 'w-[140px] sm:w-[160px] flex-shrink-0' : ''}`}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image area with badges */}
        <div
          className={`relative bg-muted overflow-hidden ${isCompact ? 'aspect-square' : 'aspect-square'}`}
        >
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              width={isCompact ? 160 : 400}
              height={isCompact ? 160 : 400}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Image
            </div>
          )}
          {product.isNew && (
            <span
              className={`absolute flex items-center justify-center rounded-[10px] bg-primary text-primary-foreground font-medium uppercase ${isCompact ? 'top-1.5 left-1.5 h-5 min-w-[1.75rem] text-[10px] px-1.5 py-0.5' : 'top-4 left-4 h-8 min-w-[2rem] text-xs px-2.5 py-1.5'}`}
            >
              New
            </span>
          )}
          {product.soldOut && (
            <span
              className={`absolute flex items-center justify-center rounded-[10px] bg-primary text-primary-foreground uppercase ${isCompact ? 'top-1.5 left-8 text-[10px] h-5 min-w-[3rem] px-1.5 py-0.5' : 'top-4 left-[4.5rem] h-8 min-w-[4.5rem] text-xs px-3 py-1.5'}`}
            >
              Sold out
            </span>
          )}
          {product.topSelling && (
            <span
              className={`absolute flex items-center justify-center rounded-[10px] bg-accent text-white uppercase ${isCompact ? 'top-1.5 right-1.5 text-[10px] h-5 min-w-[3rem] px-1.5 py-0.5' : 'top-4 right-4 h-8 min-w-[4.5rem] text-xs px-3 py-1.5'}`}
            >
              Top Selling
            </span>
          )}
          {discountPercent > 0 && (
            <span
              className={`absolute flex items-center justify-center rounded-[10px] bg-destructive text-destructive-foreground font-bold ${isCompact ? 'bottom-1.5 right-1.5 h-5 min-w-[2rem] text-[10px] px-1.5 py-0.5' : 'bottom-4 right-4 h-8 min-w-[2.5rem] text-xs px-2.5 py-1.5'}`}
            >
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product info */}
        <div
          className={
            isCompact
              ? 'p-2 space-y-0'
              : 'p-3 sm:p-4 space-y-0.5 sm:space-y-1'
          }
        >
          <h3
            className={`font-sans font-medium text-foreground leading-snug truncate ${isCompact ? 'text-xs' : 'text-sm sm:text-base'}`}
          >
            {product.name}
          </h3>
          <p
            className={`text-muted-foreground uppercase tracking-wide font-medium ${isCompact ? 'text-[10px]' : 'text-[11px] sm:text-xs'}`}
          >
            {product.category}
          </p>
          <p
            className={`font-sans font-bold text-foreground ${isCompact ? 'text-xs pt-0.5' : 'text-xs sm:text-sm pt-0.5 sm:pt-1'}`}
          >
            {showBeforeNow ? (
              <>
                <span className="line-through text-muted-foreground font-normal mr-1">
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
