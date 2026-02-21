import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Bixlay Clothing terms of service. Rules and conditions for using our website and services.',
  openGraph: { title: 'Terms of Service | ' + SITE_NAME },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Last updated: February 2025
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              Welcome to Bixlay. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Use of Our Website
            </h2>
            <p className="text-foreground/90 mb-4">
              You may use our website for lawful purposes only. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Use the site in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems, accounts, or data</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Copy, scrape, or misuse our content, design, or intellectual property without permission</li>
              <li>Impersonate Bixlay or any other person or entity</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Orders and Payment
            </h2>
            <p className="text-foreground/90 mb-4">
              When you place an order, you are making an offer to purchase. We reserve the right to accept or decline orders (e.g. due to stock, pricing errors, or suspected fraud). Payment is processed at checkout; by providing payment details, you confirm that you are authorized to use them.
            </p>
            <p className="text-foreground/90 mb-8">
              Prices are as displayed at the time of order. We may correct pricing errors and will notify you if an order is affected.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Shipping and Delivery
            </h2>
            <p className="text-foreground/90 mb-8">
              Shipping terms are set out in our{' '}
              <a href="/shipping" className="text-primary hover:underline">
                Shipping Policy
              </a>
              . Risk of loss and title pass to you upon delivery to the carrier. We are not responsible for delays caused by carriers or events outside our control.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Returns and Refunds
            </h2>
            <p className="text-foreground/90 mb-8">
              Our return and exchange policy is described in our{' '}
              <a href="/returns" className="text-primary hover:underline">
                Return &amp; Exchange Policy
              </a>
              . By placing an order, you agree to those terms.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Intellectual Property
            </h2>
            <p className="text-foreground/90 mb-8">
              All content on this website (including text, images, logos, and design) is owned by Bixlay or its licensors and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute our content without our prior written consent.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-foreground/90 mb-8">
              Our website and products are provided &quot;as is.&quot; We do not warrant that the site will be uninterrupted or error-free. To the fullest extent permitted by law, we disclaim all warranties, express or implied, regarding the site and our products.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-foreground/90 mb-8">
              To the maximum extent permitted by law, Bixlay shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the site or products, or for any loss of profits, data, or goodwill. Our total liability shall not exceed the amount you paid for the relevant order.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Governing Law
            </h2>
            <p className="text-foreground/90 mb-8">
              These terms are governed by the laws of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka, unless otherwise required by mandatory law.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Changes
            </h2>
            <p className="text-foreground/90 mb-8">
              We may update these Terms of Service at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the site after changes constitutes acceptance of the revised terms.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Contact
            </h2>
            <p className="text-foreground/90 mb-4">
              For questions about these terms, contact us at{' '}
              <a href="mailto:hello@bixlay.com" className="text-primary hover:underline">
                hello@bixlay.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
