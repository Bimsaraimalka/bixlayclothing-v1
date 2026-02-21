'use client'

import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { label: 'Men', href: '/men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80' },
  { label: 'Women', href: '/women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  { label: 'Unisex', href: '/unisex', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
] as const

export function CategoryNav() {
  return (
    <section className="w-full py-12 sm:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl sm:text-2xl font-serif font-bold text-primary uppercase tracking-tight mb-8 sm:mb-10">
          Shop by category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map(({ label, href, image }) => (
            <Link
              key={href}
              href={href}
              className="group relative aspect-[4/3] sm:aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 bg-black/40"
                  aria-hidden
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                <span className="text-white font-serif font-bold text-2xl sm:text-3xl uppercase tracking-wider drop-shadow-lg group-hover:scale-105 transition-transform">
                  {label}
                </span>
                <span className="mt-2 text-white/95 text-sm font-medium">
                  Shop now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
