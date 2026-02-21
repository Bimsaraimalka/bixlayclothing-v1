'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ProductFilter } from '@/components/product-filter'
import { ProductGrid } from '@/components/product-grid'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import type { ProductSegment } from '@/lib/admin-data'

type ProductFiltersLayoutProps = {
  segment?: ProductSegment
  newArrivalOnly?: boolean
}

export function ProductFiltersLayout({ segment, newArrivalOnly }: ProductFiltersLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const searchParams = useSearchParams()
  const hasActiveFilters = !!(
    searchParams.get('category') ||
    searchParams.get('price') ||
    searchParams.get('size') ||
    searchParams.get('color')
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {/* Desktop: sidebar filters */}
      <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
        <div className="lg:sticky lg:top-6">
          <ProductFilter />
        </div>
      </aside>

      {/* Products area: first on mobile */}
      <div className="lg:col-span-3 order-1 lg:order-2 space-y-4 sm:space-y-6">
        <ProductGrid
          segment={segment}
          newArrivalOnly={newArrivalOnly}
          filterButton={
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="lg:hidden min-h-[40px] h-10 gap-1.5 px-3 text-sm touch-manipulation shrink-0"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {hasActiveFilters && (
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[85vh] max-h-[600px] rounded-t-2xl overflow-hidden flex flex-col p-0"
              >
                <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
                  <SheetTitle className="text-lg">Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
                  <ProductFilter compact onApply={() => setSheetOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          }
        />
      </div>
    </div>
  )
}
