import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Bixlay Clothing shipping policy. Delivery times, costs, and tracking for Sri Lanka and international orders.',
  openGraph: { title: 'Shipping Policy | ' + SITE_NAME },
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Shipping Policy
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Delivery times, costs, and how we ship your order
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              At Bixlay, we aim to get your order to you safely and on time. This policy outlines how we ship orders within Sri Lanka and internationally.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Processing Time
            </h2>
            <p className="text-foreground/90 mb-4">
              Orders are processed on business days (Monday–Friday, excluding public holidays). Most orders are dispatched within <strong>2–5 business days</strong> after payment confirmation. During busy periods (e.g. sales or holidays), processing may take longer; we will notify you if there is a significant delay.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Shipping Within Sri Lanka
            </h2>
            <p className="text-foreground/90 mb-4">
              We ship across Sri Lanka using trusted local carriers. Delivery times are typically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-4">
              <li>Colombo and suburbs: approximately 2–4 business days after dispatch</li>
              <li>Other areas: approximately 4–7 business days after dispatch</li>
            </ul>
            <p className="text-foreground/90 mb-8">
              Shipping costs are calculated at checkout based on your delivery address and order size. Free shipping may apply to orders above a certain value; any such offer will be displayed on the website or at checkout.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              International Shipping
            </h2>
            <p className="text-foreground/90 mb-4">
              We offer international shipping to selected countries. Delivery times vary by destination and carrier, generally <strong>7–21 business days</strong> after dispatch. International shipping fees, customs, and import duties (if any) are the responsibility of the recipient unless otherwise stated.
            </p>
            <p className="text-foreground/90 mb-8">
              For international orders, please ensure your shipping address is complete and accurate. We are not responsible for delays or extra costs due to incorrect addresses or customs clearance.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Order Tracking
            </h2>
            <p className="text-foreground/90 mb-8">
              Once your order is dispatched, we will send you an email with tracking information (where available). You can use this to follow your delivery. If you do not receive a tracking email within the expected processing time, please contact us at{' '}
              <a href="mailto:hello@bixlay.com" className="text-primary hover:underline">
                hello@bixlay.com
              </a>
              .
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Delivery Issues
            </h2>
            <p className="text-foreground/90 mb-4">
              If your order is lost, significantly delayed, or arrives damaged, please contact us within a reasonable time (e.g. within 14 days of the expected delivery date) with your order number and any relevant details. We will work with the carrier to resolve the issue and, where appropriate, offer a replacement or refund in line with our{' '}
              <a href="/returns" className="text-primary hover:underline">
                Return &amp; Exchange Policy
              </a>
              .
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Incorrect or Incomplete Addresses
            </h2>
            <p className="text-foreground/90 mb-8">
              Please double-check your shipping address at checkout. If an order is returned to us due to an incorrect or incomplete address, we may need to charge additional shipping to resend it, or you may need to place a new order.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Contact Us
            </h2>
            <p className="text-foreground/90 mb-4">
              For shipping-related questions or to report a problem with your delivery, email us at{' '}
              <a href="mailto:hello@bixlay.com" className="text-primary hover:underline">
                hello@bixlay.com
              </a>
              . Include your order number so we can assist you quickly.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
