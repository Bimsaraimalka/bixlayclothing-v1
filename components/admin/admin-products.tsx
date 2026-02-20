'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

const PRODUCTS_LIST = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    category: 'Shirts',
    price: 29.99,
    stock: 150,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Denim Jeans',
    category: 'Pants',
    price: 79.99,
    stock: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Summer Dress',
    category: 'Dresses',
    price: 49.99,
    stock: 28,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Cotton Hoodie',
    category: 'Hoodies',
    price: 59.99,
    stock: 0,
    status: 'Out of Stock',
  },
  {
    id: '5',
    name: 'Running Shoes',
    category: 'Shoes',
    price: 99.99,
    stock: 87,
    status: 'Active',
  },
]

export function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS_LIST)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Products Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory and details
          </p>
        </div>
        <Button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
          <option>All Categories</option>
          <option>Shirts</option>
          <option>Pants</option>
          <option>Dresses</option>
          <option>Hoodies</option>
          <option>Shoes</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Product Name
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Price
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Stock
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-secondary transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-foreground">
                    {product.category}
                  </td>
                  <td className="py-4 px-6 text-foreground font-bold">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-4 px-6 text-foreground">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 50
                          ? 'bg-accent/10 text-accent'
                          : product.stock > 0
                          ? 'bg-muted text-foreground'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Active'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {products.length} products
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
