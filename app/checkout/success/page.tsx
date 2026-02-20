'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') ?? ''
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
        Save this ID to track your order in the admin or when contacting support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading…</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
