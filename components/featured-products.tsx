'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/product-card'

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Camellia maxi skirt & top',
    priceMin: 1990,
    priceMax: 4490,
    category: 'Skirts, Tops',
    isNew: true,
    soldOut: false,
    topSelling: true,
  },
  {
    id: '2',
    name: 'Stella maxi skirt & top',
    priceMin: 1990,
    priceMax: 4990,
    category: 'Skirts, Tops',
    isNew: true,
    soldOut: false,
  },
  {
    id: '3',
    name: 'Elan cotton wide leg pant',
    price: 3000,
    originalPrice: 4500,
    category: 'Pants',
    isNew: true,
    soldOut: false,
  },
  {
    id: '4',
    name: 'Nella Halter Neck Top',
    price: 3890,
    category: 'Tops',
    isNew: true,
    soldOut: false,
  },
  {
    id: '5',
    name: 'Off-shoulder floral dress',
    price: 4490,
    category: 'Dresses',
    isNew: true,
    soldOut: true,
  },
  {
    id: '6',
    name: 'Striped button-up set',
    price: 3990,
    category: 'Tops, Pants',
    isNew: true,
    soldOut: false,
  },
  {
    id: '7',
    name: 'Linen co-ord set',
    price: 4990,
    category: 'Tops, Pants',
    isNew: true,
    soldOut: false,
  },
  {
    id: '8',
    name: 'Strapless embroidered dress',
    price: 5490,
    category: 'Dresses',
    isNew: true,
    soldOut: false,
  },
]

export const FeaturedProducts = () => {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - screenshot style */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="font-serif text-foreground/60 text-xs sm:text-sm uppercase tracking-[0.2em] mb-1.5 sm:mb-2">
            Bixlay
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary uppercase tracking-tight">
            New Arrivals
          </h2>
        </div>

        {/* Products Grid - 4 columns, white cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10 sm:mt-14">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm uppercase tracking-wide"
          >
            View all products
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
