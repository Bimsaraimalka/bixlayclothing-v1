'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import type { ProductCardProduct } from '@/components/product-card'
import { useStoreProducts } from '@/hooks/use-store-products'
import { LoadingScreen } from '@/components/loading-screen'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'

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

const MIN_SLIDES_FOR_CAROUSEL = 8

function repeatToMinLength<T>(arr: T[], min: number): T[] {
  if (arr.length >= min) return arr
  const result: T[] = []
  while (result.length < min) {
    for (const item of arr) {
      result.push(item)
      if (result.length >= min) break
    }
  }
  return result
}

export const FeaturedProducts = () => {
  const { products, loading, error } = useStoreProducts()
  const newArrivals = products.filter((p) => p.new_arrival === true).slice(0, 8)
  const cardProducts = newArrivals.map(toCardProduct)
  const displayProducts = repeatToMinLength(cardProducts, MIN_SLIDES_FOR_CAROUSEL)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api || displayProducts.length <= 1) return
    const timer = setInterval(() => {
      api.scrollNext()
    }, 4000)
    return () => clearInterval(timer)
  }, [api, displayProducts.length])

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
            <Carousel
              opts={{ loop: true, align: 'start', draggable: true, dragFree: false }}
              setApi={setApi}
              className="w-full cursor-grab active:cursor-grabbing"
            >
              <CarouselContent className="-ml-4">
                {displayProducts.map((product, index) => (
                  <CarouselItem
                    key={`${product.id}-${index}`}
                    className="pl-4 basis-[45%] sm:basis-1/3 lg:basis-1/5"
                  >
                    <ProductCard product={product} size="compact" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
