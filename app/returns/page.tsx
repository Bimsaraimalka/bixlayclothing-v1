import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Return & Exchange Policy',
  description: 'Bixlay Clothing return and exchange policy. 21-day returns, store credit, and eligibility conditions.',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Return & Exchange Policy
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              At Bixlay Clothing, we take pride in the quality of our products and want you to feel confident about every purchase. If you&apos;re not completely satisfied, we&apos;re here to help with returns or exchanges.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Return & Exchange Eligibility
            </h2>
            <p className="text-foreground/90 mb-4">
              We offer a <strong>21-day return window</strong> for items purchased through our website or official sales channels (excluding items discounted 20% or more).
            </p>
            <p className="text-foreground/90 mb-4">
              To qualify for a return or exchange, items must meet the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Items must be unwashed</li>
              <li>Items must be unworn</li>
              <li>Items must be in their original packaging</li>
              <li>Items with pilling may be declined</li>
              <li>Items with marks, stains, or damage will not be accepted</li>
              <li>Items with strong odors such as smoke, cologne, or detergent will not be accepted</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Hygiene-Restricted Items
            </h2>
            <p className="text-foreground/90 mb-4">
              For hygiene and safety reasons, the following items cannot be returned or exchanged:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-4">
              <li>Socks or undergarments</li>
              <li>Bodysuits</li>
              <li>Accessories such as caps, bottles, bags, or jewelry</li>
            </ul>
            <p className="text-foreground/90 mb-8">
              Our 21-day warranty does not cover normal wear and tear or damage caused by misuse or accidents.
            </p>
            <p className="text-foreground/90 mb-8">
              If your return is approved, we will issue <strong>store credit</strong> to the email address used for your purchase (shipping costs are not included).
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">
              Store credit / gift cards / coupon codes:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Valid for 12 months from the date of issue</li>
              <li>Single-use only (remaining balance will not carry forward)</li>
            </ul>
            <p className="text-foreground/90 mb-8">
              We reserve the right to decline returns submitted after the 21-day period.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Missing, Incorrect, or Damaged Items
            </h2>
            <p className="text-foreground/90 mb-4">
              If you receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-4">
              <li>The wrong item</li>
              <li>A damaged item</li>
              <li>An order with missing items</li>
            </ul>
            <p className="text-foreground/90 mb-4">
              Please contact our support team within <strong>48 hours</strong> of receiving your order.
            </p>
            <p className="text-foreground/90 mb-2">
              <strong>Support Email:</strong>{' '}
              <a href="mailto:support@bixlay.com" className="text-primary hover:underline">
                support@bixlay.com
              </a>
            </p>
            <p className="text-foreground/90 mb-8">
              Include your order number and photos (if applicable) to help us resolve the issue quickly.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Exchanges for Out-of-Stock Items
            </h2>
            <p className="text-foreground/90 mb-8">
              If the item you wish to exchange is unavailable, we will issue store credit valid for 12 months from the issue date.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Return Shipping (Sri Lanka)
            </h2>
            <p className="text-foreground/90 mb-4">
              For returns within Sri Lanka, please contact our support team to arrange the return process.
            </p>
            <p className="text-foreground/90 mb-4">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@bixlay.com" className="text-primary hover:underline">
                support@bixlay.com
              </a>
            </p>
            <p className="text-foreground/90 mb-8">
              Once we receive and inspect the item and confirm it meets our return conditions, store credit will be issued.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              In-Store Purchases
            </h2>
            <p className="text-foreground/90 mb-4">
              Items purchased from a physical store must be exchanged at the same store location where the purchase was made.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Exchanges cannot be processed at different store locations</li>
              <li>All standard return conditions apply</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              International Orders
            </h2>
            <p className="text-foreground/90 mb-4">
              For international orders, please contact our support team:
            </p>
            <p className="text-foreground/90 mb-4">
              <a href="mailto:support@bixlay.com" className="text-primary hover:underline">
                support@bixlay.com
              </a>
            </p>
            <p className="text-foreground/90 mb-8">
              Our team will guide you through the return or exchange process.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Sale Items
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mb-8">
              <li>Items discounted 20% or more are considered final sale and cannot be returned or exchanged.</li>
              <li>Items discounted less than 20% may be returned within the 21-day return window, provided all return conditions are met.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Gift Exchanges
            </h2>
            <p className="text-foreground/90 mb-4">
              Items received as a gift may only be exchanged for the same item or color in a different size.
            </p>
            <p className="text-foreground/90 mb-4">
              To process the exchange, we may need the contact details of the purchaser to verify the order.
            </p>
            <p className="text-foreground/90 mb-8">
              Refunds or store credit are not issued for gift items.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
