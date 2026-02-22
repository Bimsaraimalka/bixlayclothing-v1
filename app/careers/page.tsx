import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Heart, Sparkles, Users } from 'lucide-react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Bixlay team. Explore open positions and learn how to build your career with us.',
  openGraph: { title: 'Careers | ' + SITE_NAME, description: 'Join the Bixlay team.' },
}

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Careers
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Join the Bixlay team
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl mb-12">
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-8">
              We’re a small team focused on quality, style, and putting the customer first. If you love clothing, care about details, and want to grow with us, we’d like to hear from you.
            </p>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
              Why work with us
            </h2>
            <ul className="space-y-4 text-foreground/90">
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart size={18} />
                </span>
                <span>Work on products you’re proud of – we care about quality and design in everything we do.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={18} />
                </span>
                <span>Room to grow – we value initiative and support learning and new ideas.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users size={18} />
                </span>
                <span>A team that works together – collaboration and respect are at the heart of how we operate.</span>
              </li>
            </ul>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-10 mb-4">
            Open positions
          </h2>
          <p className="text-foreground/90 mb-8">
            We don’t have any open roles listed right now, but we’re always interested in meeting talented people. Check back here for updates, or send us your CV and a short note about what you’re looking for.
          </p>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Get in touch</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Send your CV and a brief intro to our team. We’ll get back to you when we have a matching opportunity.
                </p>
                <a
                  href="mailto:hello@bixlay.com?subject=Careers at Bixlay"
                  className="text-primary font-medium hover:underline"
                >
                  hello@bixlay.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
