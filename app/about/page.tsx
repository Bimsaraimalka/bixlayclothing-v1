import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Bixlay – premium clothing for the modern individual. Quality, style, and comfort in every piece.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              About Us
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Our story and what we stand for
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              Bixlay is built for the modern individual who values quality, style, and comfort. We believe that great clothing should feel as good as it looks – from everyday essentials to standout pieces for special moments.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Our approach
            </h2>
            <p className="text-foreground/90 mb-4">
              We focus on thoughtful design, durable materials, and versatile fits that work across occasions. Every piece in our collection is chosen to complement your wardrobe and your life.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Quality & care
            </h2>
            <p className="text-foreground/90 mb-4">
              We work with trusted materials and construction so your pieces last. From soft cottons to structured fabrics, we prioritize comfort and longevity so you can wear Bixlay with confidence, season after season.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Get in touch
            </h2>
            <p className="text-foreground/90 mb-4">
              We&apos;d love to hear from you. For questions, feedback, or support, reach us at{' '}
              <a href="mailto:hello@bixlay.com" className="text-primary font-medium hover:underline">
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
