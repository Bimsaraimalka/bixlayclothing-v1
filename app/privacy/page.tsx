import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Bixlay Clothing privacy policy. How we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Last updated: February 2025
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              Bixlay (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you use our website or services.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Information We Collect
            </h2>
            <p className="text-foreground/90 mb-4">
              We may collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Name, email address, and phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Account credentials if you create an account</li>
              <li>Communications with our customer support</li>
              <li>Preferences, such as size or style interests, when you share them</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-foreground/90 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations, shipping updates, and customer service messages</li>
              <li>Respond to your enquiries and requests</li>
              <li>Improve our website, products, and services</li>
              <li>Send marketing communications (e.g. newsletters) if you have opted in</li>
              <li>Prevent fraud and comply with legal obligations</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Cookies and Similar Technologies
            </h2>
            <p className="text-foreground/90 mb-4">
              We use cookies and similar technologies to enhance your experience, remember your preferences, and understand how our site is used. You can manage cookie settings in your browser.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Sharing Your Information
            </h2>
            <p className="text-foreground/90 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Service providers who help us operate our business (e.g. payment processors, shipping carriers)</li>
              <li>Legal or regulatory authorities when required by law</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Data Security
            </h2>
            <p className="text-foreground/90 mb-8">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Your Rights
            </h2>
            <p className="text-foreground/90 mb-4">
              Depending on your location, you may have the right to access, correct, or delete your personal information, or to opt out of marketing. To exercise these rights or ask questions about our practices, contact us at{' '}
              <a href="mailto:hello@bixlay.com" className="text-primary hover:underline">
                hello@bixlay.com
              </a>
              .
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-foreground/90 mb-8">
              We may update this privacy policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Contact Us
            </h2>
            <p className="text-foreground/90 mb-4">
              For privacy-related questions or requests, please contact us at{' '}
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
