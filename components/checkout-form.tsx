'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export function CheckoutForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order submitted:', formData)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Shipping Information */}
            <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                Payment Information
              </h2>

              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  name="cardCVC"
                  placeholder="CVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-border" required />
                <span className="text-sm text-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <Button className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold rounded-lg transition-colors">
              Place Order
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-4 sm:p-6 bg-secondary space-y-4 sm:space-y-6 sticky top-20">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 border-b border-border pb-4">
              {[
                { name: 'Classic T-Shirt (x2)', price: 59.98 },
                { name: 'Denim Jeans (x1)', price: 79.99 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-foreground/80">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-foreground/80">
                <span>Subtotal</span>
                <span>{formatPrice(139.97)}</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>Shipping</span>
                <span className="text-accent font-medium">Free</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>Tax</span>
                <span>{formatPrice(14)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between text-lg">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-primary text-2xl">{formatPrice(153.97)}</span>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <span>✓</span>
                <span>Secure SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <span>✓</span>
                <span>30-day Money Back</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <span>✓</span>
                <span>Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
