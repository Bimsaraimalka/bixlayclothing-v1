'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, Tag } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { validatePromoCode } from '@/app/actions/promo'
import { useCartProductImages } from '@/hooks/use-cart-product-images'
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
  const { isOpen, closeCart, items, itemCount, updateQuantity, removeItem, appliedPromo, setAppliedPromo } = useCart()
  const productImages = useCartProductImages(items)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === 'percent'
      ? Math.round(subtotal * (appliedPromo.discount_value / 100))
      : Math.min(appliedPromo.discount_value, subtotal)
    : 0
  const total = Math.max(0, subtotal - discountAmount)

  const handleApplyPromo = async () => {
    const code = promoInput.trim()
    if (!code) return
    setPromoError('')
    setPromoLoading(true)
    try {
      const result = await validatePromoCode(code)
      if (result.valid) {
        setAppliedPromo({
          code: result.code,
          discount_type: result.discount_type,
          discount_value: result.discount_value,
        })
        setPromoInput('')
      } else {
        setPromoError(result.error)
      }
    } catch {
      setPromoError('Could not validate code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

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
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {productImages[item.id] ? (
                      <Image
                        src={productImages[item.id]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">Image</span>
                    )}
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
            {/* Promo code */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                    <Tag size={12} className="inline mr-1.5 text-primary shrink-0" />
                    {appliedPromo.code}
                    {appliedPromo.discount_type === 'percent'
                      ? ` (${appliedPromo.discount_value}% off)`
                      : ` (Rs. ${appliedPromo.discount_value} off)`}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="p-1 rounded hover:bg-background text-muted-foreground touch-manipulation shrink-0"
                    aria-label="Remove promo code"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 min-h-[40px] px-2.5 py-2 border border-border rounded-lg bg-background text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                    disabled={promoLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-[40px] shrink-0 touch-manipulation"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                  >
                    {promoLoading ? '…' : 'Apply'}
                  </Button>
                </div>
              )}
              {promoError && <p className="text-xs text-destructive">{promoError}</p>}
            </div>

            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && appliedPromo && (
              <div className="flex justify-between text-sm sm:text-base text-accent font-medium">
                <span>Discount ({appliedPromo.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold">
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
