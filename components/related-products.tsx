'use client'

import { ProductCard } from '@/components/product-card'

const RELATED_PRODUCTS = [
  { id: '4', name: 'Cotton Hoodie', price: 59.99, category: 'Hoodies', isNew: true, soldOut: false },
  { id: '7', name: 'Casual Shorts', price: 39.99, category: 'Shorts', isNew: true, soldOut: false },
  { id: '8', name: 'Wool Sweater', price: 89.99, category: 'Sweaters', isNew: true, soldOut: false },
  { id: '2', name: 'Denim Jeans', price: 79.99, category: 'Pants', isNew: true, soldOut: false },
  { id: '3', name: 'Summer Dress', price: 49.99, category: 'Dresses', isNew: true, soldOut: false },
  { id: '5', name: 'Running Shoes', price: 99.99, category: 'Shoes', isNew: true, soldOut: false },
  { id: '6', name: 'Leather Jacket', price: 199.99, category: 'Jackets', isNew: true, soldOut: false },
  { id: '9', name: 'Linen Shirt', price: 44.99, category: 'Shirts', isNew: false, soldOut: false },
]

export function RelatedProducts() {
  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1.5 sm:mb-2">
          You May Also Like
        </h2>
        <p className="text-sm sm:text-base text-foreground/70">
          Discover similar items that complement this product
        </p>
      </div>

      {/* Products Grid - same layout as New Arrivals / product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {RELATED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
