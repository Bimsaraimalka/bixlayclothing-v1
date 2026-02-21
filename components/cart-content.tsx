'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, Tag, X } from 'lucide-react'
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
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart-context'
import { validatePromoCode } from '@/app/actions/promo'

export function CartContent() {
  const { items: cartItems, updateQuantity, removeItem, appliedPromo, setAppliedPromo } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const freeShippingThreshold = 5000
  const shipping = subtotal > freeShippingThreshold ? 0 : 200
  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === 'percent'
      ? Math.round(subtotal * (appliedPromo.discount_value / 100))
      : Math.min(appliedPromo.discount_value, subtotal)
    : 0
  const afterDiscount = Math.max(0, subtotal - discountAmount)
  const tax = Math.round(afterDiscount * 0.1)
  const total = afterDiscount + shipping + tax

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
                {/* Item Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground text-sm">
                      <div>
                        <p>Product</p>
                        <p>Image</p>
                      </div>
                    </div>
                  )}
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
                  <div className="flex items-center gap-1 w-fit">
                    <button
                      type="button"
                      onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, -1)}
                      className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center text-base font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, 1)}
                      className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => setItemToRemove(`${item.id}-${item.size}-${item.color}`)}
                  className="self-start min-w-[44px] min-h-[44px] p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive shrink-0 flex items-center justify-center touch-manipulation"
                  aria-label="Remove item"
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

              {/* Promo code */}
              <div className="space-y-2">
                {appliedPromo ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/50 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">
                      <Tag size={14} className="inline mr-1.5 text-primary" />
                      {appliedPromo.code}
                      {appliedPromo.discount_type === 'percent'
                        ? ` (${appliedPromo.discount_value}% off)`
                        : ` (Rs. ${appliedPromo.discount_value} off)`}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground touch-manipulation"
                      aria-label="Remove promo code"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 min-h-[44px] px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                      disabled={promoLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-[44px] shrink-0 touch-manipulation"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </Button>
                  </div>
                )}
                {promoError && <p className="text-sm text-destructive">{promoError}</p>}
              </div>

              {/* Summary Details */}
              <div className="space-y-4 border-b border-border pb-4 text-base">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>Discount{appliedPromo ? ` (${appliedPromo.code})` : ''}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
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
                <Button className="w-full min-h-[44px] py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold touch-manipulation">
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

      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent className="max-w-sm rounded-xl p-4 sm:p-6 gap-4">
          <AlertDialogHeader className="text-left gap-2">
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToRemove
                ? `Remove "${cartItems.find((i) => `${i.id}-${i.size}-${i.color}` === itemToRemove)?.name ?? 'this item'}" from your cart?`
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
    </div>
  )
}
