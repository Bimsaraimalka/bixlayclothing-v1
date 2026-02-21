import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail } from 'lucide-react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Bixlay. Email us at hello@bixlay.com for questions, orders, or support.',
  openGraph: { title: 'Contact Us | ' + SITE_NAME, description: "We're here to help." },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              We&apos;re here to help
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl space-y-8">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed">
              Have a question about your order, our products, or something else? Send us an email and we&apos;ll get back to you as soon as we can.
            </p>

            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Email</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    For orders, returns, and general enquiries
                  </p>
                  <a
                    href="mailto:hello@bixlay.com"
                    className="inline-block py-2 text-primary font-medium hover:underline text-base sm:text-lg touch-manipulation"
                  >
                    hello@bixlay.com
                  </a>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              We typically respond within 1–2 business days. If your message is about an existing order, please include your order number so we can help you faster.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
