'use client'

import { useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useStoreCategories } from '@/hooks/use-store-categories'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const PRICE_OPTIONS = [
  { label: 'Under Rs. 2,500', value: '0-2500' },
  { label: 'Rs. 2,500 – Rs. 5,000', value: '2500-5000' },
  { label: 'Rs. 5,000 – Rs. 10,000', value: '5000-10000' },
  { label: 'Rs. 10,000+', value: '10000+' },
] as const

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Pink', 'Beige'] as const

type ProductFilterContentProps = {
  onFilterChange?: () => void
  /** When true, use mobile-friendly chip layout and larger touch targets (e.g. in sheet) */
  variant?: 'sidebar' | 'sheet'
}

function ProductFilterContent({ onFilterChange, variant = 'sidebar' }: ProductFilterContentProps) {
  const isSheet = variant === 'sheet'
  const [expandedSection, setExpandedSection] = useState<string | null>(isSheet ? null : 'category')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories, loading } = useStoreCategories()

  const toggleSection = (section: string) => {
    if (isSheet) return
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

  const linkProps = (url: string) => ({
    href: url,
    onClick: onFilterChange,
  })

  const chipClass = (selected: boolean) =>
    isSheet
      ? `inline-flex items-center justify-center min-h-[44px] px-4 py-3 rounded-xl text-sm font-medium touch-manipulation border transition-colors ${
          selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 border-border text-foreground'
        }`
      : ''

  const sectionHeaderClass = isSheet
    ? 'text-base font-semibold text-foreground min-h-[48px] py-3'
    : 'text-base font-semibold text-foreground min-h-[44px] py-2'

  const optionsWrapClass = isSheet ? 'flex flex-wrap gap-2 mt-3' : 'mt-4 space-y-3'

  const optionLinkClass = (selected: boolean) =>
    isSheet
      ? chipClass(selected)
      : `flex items-center gap-3 cursor-pointer group block py-2.5 min-h-[44px] touch-manipulation ${selected ? 'font-medium text-primary' : ''}`

  const optionTextClass = isSheet ? '' : 'text-sm text-foreground group-hover:text-primary transition-colors'

  const showSection = (section: string) => isSheet || expandedSection === section

  return (
    <div className={isSheet ? 'space-y-6 pb-2' : 'space-y-4 sm:space-y-6'}>
      {/* Category Filter */}
      <div className={isSheet ? 'pb-6 border-b border-border' : 'border-b border-border pb-4 sm:pb-6'}>
        {isSheet ? (
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Category</p>
        ) : (
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className={`w-full flex items-center justify-between transition-colors touch-manipulation ${sectionHeaderClass}`}
          >
            Category
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${expandedSection === 'category' ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {showSection('category') && (
          <div className={optionsWrapClass}>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category}
                  {...linkProps(buildUrl({ category: currentCategory === category ? '' : category }))}
                  className={optionLinkClass(currentCategory === category)}
                >
                  <span className={optionTextClass}>{category}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className={isSheet ? 'pb-6 border-b border-border' : 'border-b border-border pb-4 sm:pb-6'}>
        {isSheet ? (
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Price</p>
        ) : (
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className={`w-full flex items-center justify-between transition-colors touch-manipulation ${sectionHeaderClass}`}
          >
            Price
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${expandedSection === 'price' ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {showSection('price') && (
          <div className={optionsWrapClass}>
            {PRICE_OPTIONS.map(({ label, value }) => (
              <Link
                key={value}
                {...linkProps(buildUrl({ price: currentPrice === value ? '' : value }))}
                className={optionLinkClass(currentPrice === value)}
              >
                <span className={optionTextClass}>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className={isSheet ? 'pb-6 border-b border-border' : 'border-b border-border pb-4 sm:pb-6'}>
        {isSheet ? (
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Size</p>
        ) : (
          <button
            type="button"
            onClick={() => toggleSection('size')}
            className={`w-full flex items-center justify-between transition-colors touch-manipulation ${sectionHeaderClass}`}
          >
            Size
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${expandedSection === 'size' ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {showSection('size') && (
          <div className={optionsWrapClass}>
            {SIZES.map((size) => (
              <Link
                key={size}
                {...linkProps(buildUrl({ size: currentSize === size ? '' : size }))}
                className={optionLinkClass(currentSize === size)}
              >
                <span className={optionTextClass}>{size}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className={isSheet ? 'pb-6' : 'pb-4 sm:pb-6'}>
        {isSheet ? (
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Color</p>
        ) : (
          <button
            type="button"
            onClick={() => toggleSection('color')}
            className={`w-full flex items-center justify-between transition-colors touch-manipulation ${sectionHeaderClass}`}
          >
            Color
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${expandedSection === 'color' ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {showSection('color') && (
          <div className={optionsWrapClass}>
            {COLORS.map((color) => (
              <Link
                key={color}
                {...linkProps(buildUrl({ color: currentColor === color ? '' : color }))}
                className={optionLinkClass(currentColor === color)}
              >
                <span className={optionTextClass}>{color}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters — simple button on mobile */}
      {hasActiveFilters && (
        <Link
          href={basePath}
          onClick={onFilterChange}
          className={
            isSheet
              ? 'flex items-center justify-center min-h-[48px] py-3 px-4 rounded-xl text-base font-medium bg-secondary text-foreground touch-manipulation'
              : 'w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-lg border border-border text-primary font-medium hover:bg-secondary transition-colors text-sm sm:text-base block text-center touch-manipulation flex items-center justify-center'
          }
        >
          Clear all filters
        </Link>
      )}
    </div>
  )
}

export function MobileFilterTrigger() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? ''
  const currentPrice = searchParams.get('price') ?? ''
  const currentSize = searchParams.get('size') ?? ''
  const currentColor = searchParams.get('color') ?? ''
  const hasActiveFilters = !!(currentCategory || currentPrice || currentSize || currentColor)
  const activeCount = [currentCategory, currentPrice, currentSize, currentColor].filter(Boolean).length
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="w-full sm:w-auto min-h-[44px] touch-manipulation gap-2 text-base font-medium"
        >
          <SlidersHorizontal className="size-5" aria-hidden />
          Filters
          {hasActiveFilters && (
            <span className="text-muted-foreground font-normal">({activeCount})</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] flex flex-col p-0 rounded-t-2xl"
      >
        <SheetHeader className="p-4 pb-2 border-b border-border shrink-0">
          <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <ProductFilterContent variant="sheet" onFilterChange={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function ProductFilter() {
  return (
    <>
      {/* Desktop: sidebar content */}
      <div className="hidden lg:block">
        <ProductFilterContent />
      </div>
    </>
  )
}
