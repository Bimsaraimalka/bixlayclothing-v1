import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
