'use client'

import Link from 'next/link'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function CartDrawer() {
  const { isOpen, closeCart, items, itemCount, updateQuantity, removeItem } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
        aria-hidden
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-background border-l border-border shadow-xl z-50 flex flex-col transition-transform duration-300 ease-out animate-in slide-in-from-right"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-primary">
            Your Cart
            <span className="ml-2 text-base font-sans font-medium text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={22} className="text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-base mb-4">Your cart is empty</p>
              <Button onClick={closeCart} variant="outline" size="default">
                Continue shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground text-xs sm:text-sm">
                    Image
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-base truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} · {item.color}
                    </p>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-secondary rounded"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center text-base font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-secondary rounded"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded ml-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/cart" onClick={closeCart} className="block">
              <Button variant="outline" className="w-full">
                View full cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
