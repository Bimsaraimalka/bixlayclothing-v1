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
  size?: 'default' | 'compact'
}

export function ProductCard({ product, size = 'default' }: ProductCardProps) {
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

  const isCompact = size === 'compact'
  const imageBadgeClass = isCompact ? 'top-2 left-2 h-6 min-w-[1.5rem] text-[10px] px-1.5 py-0.5 rounded-md' : 'top-4 left-4 h-8 min-w-[2rem] text-xs px-2.5 py-1.5 rounded-[10px]'
  const soldOutBadgeClass = isCompact ? 'top-2 left-9 h-6 min-w-[3rem] text-[10px] px-2 py-0.5 rounded-md' : 'top-4 left-[4.5rem] h-8 min-w-[4.5rem] text-xs px-3 py-1.5 rounded-[10px]'
  const topSellingBadgeClass = isCompact ? 'top-2 right-2 h-6 min-w-[3rem] text-[10px] px-2 py-0.5 rounded-md' : 'top-4 right-4 h-8 min-w-[4.5rem] text-xs px-3 py-1.5 rounded-[10px]'
  const discountBadgeClass = isCompact ? 'bottom-2 right-2 h-6 min-w-[2rem] text-[10px] px-1.5 py-0.5 rounded-md' : 'bottom-4 right-4 h-8 min-w-[2.5rem] text-xs px-2.5 py-1.5 rounded-[10px]'
  const infoPadding = isCompact ? 'p-2 space-y-0' : 'p-3 sm:p-4 space-y-0.5 sm:space-y-1'
  const titleClass = isCompact ? 'text-xs font-medium leading-tight line-clamp-2' : 'text-sm sm:text-base font-medium leading-snug'
  const categoryClass = isCompact ? 'text-[10px]' : 'text-[11px] sm:text-xs'
  const priceClass = isCompact ? 'text-xs pt-0.5' : 'text-xs sm:text-sm pt-0.5 sm:pt-1'

  return (
    <div className={`group bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 ${isCompact ? 'hover:-translate-y-0.5' : ''}`}>
      <Link href={`/products/${product.id}`} className="block">
        {/* Image area with badges */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              width={400}
              height={400}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Image
            </div>
          )}
          {product.isNew && (
            <span className={`absolute flex items-center justify-center bg-primary text-primary-foreground font-medium uppercase ${imageBadgeClass}`}>
              New
            </span>
          )}
          {product.soldOut && (
            <span className={`absolute flex items-center justify-center bg-primary text-primary-foreground font-medium uppercase ${soldOutBadgeClass}`}>
              Sold out
            </span>
          )}
          {product.topSelling && (
            <span className={`absolute flex items-center justify-center bg-accent text-white font-medium uppercase ${topSellingBadgeClass}`}>
              Top Selling
            </span>
          )}
          {discountPercent > 0 && (
            <span className={`absolute flex items-center justify-center bg-destructive text-destructive-foreground font-bold ${discountBadgeClass}`}>
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product info */}
        <div className={`${infoPadding}`}>
          <h3 className={`font-sans text-foreground ${titleClass}`}>
            {product.name}
          </h3>
          <p className={`${categoryClass} text-muted-foreground uppercase tracking-wide font-medium`}>
            {product.category}
          </p>
          <p className={`font-sans font-bold text-foreground ${priceClass}`}>
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
