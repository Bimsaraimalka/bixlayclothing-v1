'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-context'
import type { StoreSettings } from '@/lib/admin-data'

function SuccessContent({ storeSettings }: { storeSettings: StoreSettings }) {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') ?? ''
  const { clearCart } = useCart()
  const clearedRef = useRef(false)
  useEffect(() => {
    if (orderId && !clearedRef.current) {
      clearedRef.current = true
      clearCart()
    }
  }, [orderId, clearCart])
  const showPhone = storeSettings.contact_phone_visible && storeSettings.contact_phone && storeSettings.contact_phone.trim() !== ''

  return (
    <div className="text-center max-w-md">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">
        Thank you for your order
      </h1>
      <p className="text-muted-foreground mb-6">
        We&apos;ll send a confirmation to your email shortly.
      </p>
      {orderId && (
        <p className="text-lg font-semibold text-foreground mb-2">
          Your order ID: <span className="text-primary">{orderId}</span>
        </p>
      )}
      <p className="text-sm text-muted-foreground mb-8">
        Save this ID to track your order or when contacting support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-secondary/50 p-4 text-left">
        <p className="text-sm font-medium text-foreground mb-2">Need help? Contact customer care</p>
        <p className="text-sm text-muted-foreground mb-1">
          Email:{' '}
          <a href="mailto:hello@bixlay.com" className="text-primary font-medium hover:underline">
            hello@bixlay.com
          </a>
        </p>
        {showPhone && (
          <p className="text-sm text-muted-foreground">
            Phone:{' '}
            <a
              href={`tel:${storeSettings.contact_phone!.replace(/\s/g, '')}`}
              className="text-primary font-medium hover:underline"
            >
              {storeSettings.contact_phone}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

export function CheckoutSuccessClient({ storeSettings }: { storeSettings: StoreSettings }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading…</div>}>
          <SuccessContent storeSettings={storeSettings} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
