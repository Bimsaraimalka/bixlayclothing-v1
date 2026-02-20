'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart-context'

export function CartContent() {
  const { items: cartItems, updateQuantity, removeItem } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const freeShippingThreshold = 5000
  const shipping = subtotal > freeShippingThreshold ? 0 : 200
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {cartItems.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-3 sm:mb-4">
            Your cart is empty
          </h2>
          <p className="text-base text-foreground/70 mb-8">
            Explore our collection and add some items to get started.
          </p>
          <Link href="/products">
            <Button className="px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map(item => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-3 sm:gap-4 border border-border rounded-lg p-3 sm:p-4 bg-background"
              >
                {/* Item Image Placeholder */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-center text-muted-foreground text-sm">
                    <p>Product</p>
                    <p>Image</p>
                  </div>
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                  <h3 className="font-serif font-bold text-primary text-lg sm:text-xl truncate">
                    {item.name}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Size: <span className="font-medium text-foreground">{item.size}</span> • Color: <span className="font-medium text-foreground">{item.color}</span>
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 hover:bg-secondary rounded transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center text-base font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 hover:bg-secondary rounded transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive shrink-0 h-10 w-10 flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-4 sm:p-6 bg-secondary space-y-4 sm:space-y-6 sticky top-20">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">Order Summary</h3>

              {/* Summary Details */}
              <div className="space-y-4 border-b border-border pb-4 text-base">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-accent font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary text-2xl">{formatPrice(total)}</span>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block w-full">
                <Button className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/products" className="block text-center">
                <button className="w-full py-2.5 text-base text-primary hover:underline font-medium">
                  Continue Shopping
                </button>
              </Link>

              {/* Info Messages */}
              {subtotal < freeShippingThreshold && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-base text-foreground">
                    <span className="font-medium">Free shipping</span> for orders over Rs. 5,000
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
