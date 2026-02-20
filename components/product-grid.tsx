'use client'

import { ProductCard } from '@/components/product-card'

// Sample products data - same card style as New Arrivals (Shop, Men, Women)
const PRODUCTS = [
  { id: '1', name: 'Classic T-Shirt', price: 29.99, category: 'Shirts', isNew: true, soldOut: false },
  { id: '2', name: 'Denim Jeans', price: 79.99, category: 'Pants', isNew: true, soldOut: false },
  { id: '3', name: 'Summer Dress', price: 49.99, category: 'Dresses', isNew: true, soldOut: false },
  { id: '4', name: 'Cotton Hoodie', price: 59.99, category: 'Hoodies', isNew: true, soldOut: false },
  { id: '5', name: 'Running Shoes', price: 99.99, category: 'Shoes', isNew: true, soldOut: true },
  { id: '6', name: 'Leather Jacket', price: 199.99, category: 'Jackets', isNew: true, soldOut: false },
  { id: '7', name: 'Casual Shorts', price: 39.99, category: 'Shorts', isNew: true, soldOut: false },
  { id: '8', name: 'Wool Sweater', price: 89.99, category: 'Sweaters', isNew: true, soldOut: false },
]

export function ProductGrid() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Results Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {PRODUCTS.length} products
        </p>
        <select className="px-3 sm:px-4 py-2 border border-border rounded-lg bg-background text-foreground text-xs sm:text-sm w-full sm:w-auto">
          <option>Sort: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Best Sellers</option>
        </select>
      </div>

      {/* Products Grid - same card style as New Arrivals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
