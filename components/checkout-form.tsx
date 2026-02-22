'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart-context'
import { addOrderSupabase } from '@/lib/supabase-data'
import { sendNewOrderNotification } from '@/app/actions/notify-new-order'
import { CreditCard, Building2, Banknote, HelpCircle } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 5000
const SHIPPING = 399
const TAX_RATE = 0.1
const CARD_PROCESSING_FEE = 100

export type PaymentMethod = 'bank_transfer' | 'card' | 'cash_on_delivery'

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart, appliedPromo } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
    emailNewsOffers: false,
    saveInfo: false,
    textOffers: false,
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === 'percent'
      ? Math.round(subtotal * (appliedPromo.discount_value / 100))
      : Math.min(appliedPromo.discount_value, subtotal)
    : 0
  const afterDiscount = Math.max(0, subtotal - discountAmount)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING
  const tax = Math.round(afterDiscount * TAX_RATE)
  const cardProcessingFee = paymentMethod === 'card' ? CARD_PROCESSING_FEE : 0
  const total = afterDiscount + shipping + tax + cardProcessingFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target
    const { name } = target
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const customer = `${formData.firstName.trim()} ${formData.lastName.trim()}`
      const addressLine = [formData.address.trim(), formData.apartment.trim()].filter(Boolean).join(', ') || null
      const order = await addOrderSupabase({
        customer,
        email: formData.email.trim(),
        amount: formatPrice(total),
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
        promo_code: appliedPromo?.code ?? null,
        payment_method: paymentMethod,
        phone: formData.phone.trim() || null,
        address: addressLine,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        zip_code: formData.zipCode.trim() || null,
        country: formData.country.trim() || 'Sri Lanka',
      })
      sendNewOrderNotification({
        id: order.id,
        customer: order.customer,
        email: order.email,
        amount: order.amount,
        payment_method: order.payment_method ?? null,
        phone: order.phone ?? null,
        address: order.address ?? null,
        city: order.city ?? null,
        state: order.state ?? null,
        zip_code: order.zip_code ?? null,
        country: order.country ?? null,
      }).catch(() => {})
      clearCart()
      router.push(`/checkout/success?order=${encodeURIComponent(order.id)}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button onClick={() => router.push('/products')}>Continue shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Contact */}
              <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 bg-background">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                  <Link href="/account/login" className="text-sm text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                  required
                />
                <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    name="emailNewsOffers"
                    checked={formData.emailNewsOffers}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                  <span className="text-sm text-foreground">Email me with news and offers</span>
                </label>
              </div>

              {/* Delivery */}
              <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background">
                <h2 className="text-lg font-semibold text-foreground">Delivery</h2>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Country/Region</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                  required
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Postal code (optional)"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                  />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-4 py-3 pr-11 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" title="Phone number for delivery">
                    <HelpCircle className="size-5" />
                  </span>
                </div>
                <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                  <span className="text-sm text-foreground">Save this information for next time</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    name="textOffers"
                    checked={formData.textOffers}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                  <span className="text-sm text-foreground">Text me with news and offers</span>
                </label>
              </div>

              {/* Shipping method */}
              <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 bg-background">
                <h2 className="text-lg font-semibold text-foreground">Shipping method</h2>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Standard</p>
                    <p className="text-sm text-muted-foreground">2-3 Business Days</p>
                  </div>
                  <span className="font-medium text-foreground">{formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                  Payment method
                </h2>
                <fieldset className="space-y-3">
                  <legend className="sr-only">Choose payment method</legend>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer touch-manipulation hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="w-5 h-5 text-primary border-border"
                    />
                    <Building2 size={20} className="text-muted-foreground shrink-0" />
                    <span className="text-base font-medium">1. Bank transfer</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer touch-manipulation hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 text-primary border-border"
                    />
                    <CreditCard size={20} className="text-muted-foreground shrink-0" />
                    <span className="text-base font-medium">2. Visa, Debit & Mastercard</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer touch-manipulation hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="w-5 h-5 text-primary border-border"
                    />
                    <Banknote size={20} className="text-muted-foreground shrink-0" />
                    <span className="text-base font-medium">3. Cash on delivery</span>
                  </label>
                </fieldset>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">Card details</p>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                      required={paymentMethod === 'card'}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                        required={paymentMethod === 'card'}
                      />
                      <input
                        type="text"
                        name="cardCVC"
                        placeholder="CVC"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        className="min-h-[44px] px-4 py-3 border border-border rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 py-2 cursor-pointer touch-manipulation min-h-[44px]">
                  <input type="checkbox" className="w-5 h-5 rounded border-border shrink-0 mt-0.5" required />
                  <span className="text-sm sm:text-base text-foreground">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
              >
                {submitting ? 'Placing order…' : 'Place Order'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-4 sm:p-6 bg-secondary space-y-4 sm:space-y-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-primary">
                Order Summary
              </h2>
              <div className="space-y-4 border-b border-border pb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-foreground/80">
                    <span className="text-sm">
                      {item.name} ({item.size} · {item.color}) ×{item.quantity}
                    </span>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
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
                  <span>{shipping === 0 ? <span className="text-accent font-medium">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {cardProcessingFee > 0 && (
                  <div className="flex justify-between text-foreground/80">
                    <span>Card processing fee</span>
                    <span>{formatPrice(cardProcessingFee)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-lg">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
