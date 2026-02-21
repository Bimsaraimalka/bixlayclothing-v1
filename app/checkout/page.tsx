import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutForm } from '@/components/checkout-form'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Bixlay order. Secure payment and delivery details.',
  robots: { index: false, follow: true },
  openGraph: { title: 'Checkout | ' + SITE_NAME },
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Checkout
            </h1>
          </div>
        </section>
        <CheckoutForm />
      </main>
      <Footer />
    </div>
  )
}
