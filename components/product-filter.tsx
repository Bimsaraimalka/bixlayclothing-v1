'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useStoreCategories } from '@/hooks/use-store-categories'

const PRICE_OPTIONS = [
  { label: 'Under Rs. 2,500', value: '0-2500' },
  { label: 'Rs. 2,500 – Rs. 5,000', value: '2500-5000' },
  { label: 'Rs. 5,000 – Rs. 10,000', value: '5000-10000' },
  { label: 'Rs. 10,000+', value: '10000+' },
] as const

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Pink', 'Beige'] as const

export function ProductFilter() {
  const [expandedSection, setExpandedSection] = useState<string | null>('category')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories, loading } = useStoreCategories()

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const basePath = pathname === '/men' ? '/men' : pathname === '/women' ? '/women' : pathname === '/new-arrivals' ? '/new-arrivals' : '/products'

  const currentCategory = searchParams.get('category') ?? ''
  const currentPrice = searchParams.get('price') ?? ''
  const currentSize = searchParams.get('size') ?? ''
  const currentColor = searchParams.get('color') ?? ''

  function buildUrl(updates: { category?: string; price?: string; size?: string; color?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    if (updates.category !== undefined) updates.category ? params.set('category', updates.category) : params.delete('category')
    if (updates.price !== undefined) updates.price ? params.set('price', updates.price) : params.delete('price')
    if (updates.size !== undefined) updates.size ? params.set('size', updates.size) : params.delete('size')
    if (updates.color !== undefined) updates.color ? params.set('color', updates.color) : params.delete('color')
    const q = params.toString()
    return q ? `${basePath}?${q}` : basePath
  }

  const hasActiveFilters = !!(currentCategory || currentPrice || currentSize || currentColor)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors min-h-[44px] py-2 touch-manipulation"
        >
          Category
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedSection === 'category' ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSection === 'category' && (
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">No categories</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category}
                  href={buildUrl({ category: currentCategory === category ? '' : category })}
                  className={`flex items-center gap-3 cursor-pointer group block py-2.5 min-h-[44px] touch-manipulation ${currentCategory === category ? 'font-medium text-primary' : ''}`}
                >
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors min-h-[44px] py-2 touch-manipulation"
        >
          Price
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedSection === 'price' ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSection === 'price' && (
          <div className="mt-4 space-y-3">
            {PRICE_OPTIONS.map(({ label, value }) => (
              <Link
                key={value}
                href={buildUrl({ price: currentPrice === value ? '' : value })}
                className={`flex items-center gap-3 cursor-pointer group block py-2.5 min-h-[44px] touch-manipulation ${currentPrice === value ? 'font-medium text-primary' : ''}`}
              >
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          type="button"
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors min-h-[44px] py-2 touch-manipulation"
        >
          Size
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedSection === 'size' ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSection === 'size' && (
          <div className="mt-4 space-y-3">
            {SIZES.map((size) => (
              <Link
                key={size}
                href={buildUrl({ size: currentSize === size ? '' : size })}
                className={`flex items-center gap-3 cursor-pointer group block py-2.5 min-h-[44px] touch-manipulation ${currentSize === size ? 'font-medium text-primary' : ''}`}
              >
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {size}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="pb-4 sm:pb-6">
        <button
          type="button"
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors min-h-[44px] py-2 touch-manipulation"
        >
          Color
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedSection === 'color' ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSection === 'color' && (
          <div className="mt-4 space-y-3">
            {COLORS.map((color) => (
              <Link
                key={color}
                href={buildUrl({ color: currentColor === color ? '' : color })}
                className={`flex items-center gap-3 cursor-pointer group block py-2.5 min-h-[44px] touch-manipulation ${currentColor === color ? 'font-medium text-primary' : ''}`}
              >
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {color}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Link
          href={basePath}
          className="w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-lg border border-border text-primary font-medium hover:bg-secondary transition-colors text-sm sm:text-base block text-center touch-manipulation flex items-center justify-center"
        >
          Clear Filters
        </Link>
      )}
    </div>
  )
}
