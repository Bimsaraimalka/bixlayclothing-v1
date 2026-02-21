'use client'

import { ProductCard } from '@/components/product-card'
import type { ProductCardProduct } from '@/components/product-card'
import { useStoreProducts } from '@/hooks/use-store-products'

function toCardProduct(p: {
  id: string
  name: string
  category: string
  price: number
  status: string
  image_urls?: string[]
}): ProductCardProduct {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    imageUrl: p.image_urls?.[0],
    isNew: true,
    soldOut: p.status === 'Out of Stock',
  }
}

export function RelatedProducts({ excludeProductId }: { excludeProductId?: string }) {
  const { products } = useStoreProducts()
  const related = products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, 4)
    .map(toCardProduct)

  if (related.length === 0) return null

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1.5 sm:mb-2">
          You May Also Like
        </h2>
        <p className="text-sm sm:text-base text-foreground/70">
          Discover similar items that complement this product
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
