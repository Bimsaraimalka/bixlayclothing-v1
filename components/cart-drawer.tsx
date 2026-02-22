'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function CartDrawer() {
  const { isOpen, closeCart, items, itemCount, updateQuantity, removeItem, appliedPromo } = useCart()
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === 'percent'
      ? Math.round(subtotal * (appliedPromo.discount_value / 100))
      : Math.min(appliedPromo.discount_value, subtotal)
    : 0
  const total = Math.max(0, subtotal - discountAmount)

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
            className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-secondary rounded-lg transition-colors touch-manipulation flex items-center justify-center"
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
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, -1)}
                        className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded flex items-center justify-center touch-manipulation"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center text-base font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, 1)}
                        className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded flex items-center justify-center touch-manipulation"
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToRemove(`${item.id}-${item.size}-${item.color}`)}
                        className="min-w-[44px] min-h-[44px] p-2 hover:bg-destructive/10 text-destructive rounded flex items-center justify-center touch-manipulation ml-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
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
            {discountAmount > 0 && appliedPromo && (
              <div className="flex justify-between text-base text-accent font-medium">
                <span>Discount ({appliedPromo.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/cart" onClick={closeCart} className="block">
              <Button variant="outline" className="w-full min-h-[44px] touch-manipulation">
                View full cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button className="w-full min-h-[44px] touch-manipulation">Checkout</Button>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent className="max-w-sm rounded-xl p-4 sm:p-6 gap-4">
          <AlertDialogHeader className="text-left gap-2">
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToRemove
                ? `Remove "${items.find((i) => `${i.id}-${i.size}-${i.color}` === itemToRemove)?.name ?? 'this item'}" from your cart?`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (itemToRemove) {
                  removeItem(itemToRemove)
                  setItemToRemove(null)
                }
              }}
              className="m-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
