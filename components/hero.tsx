import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <section className="w-full py-[10px] bg-gradient-to-b from-secondary to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[360px] lg:min-h-[560px]">
          {/* Left: Copy */}
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-primary uppercase tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              New Arrivals
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-foreground/70 max-w-md mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed lg:max-w-sm">
              Curated styles for every moment. Quality fabrics, modern fits, delivered to you.
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6 sm:mb-8 text-xs text-foreground/60 uppercase tracking-wider">
              <span>Premium fabrics</span>
              <span className="text-foreground/40">·</span>
              <span>Thoughtful design</span>
              <span className="text-foreground/40">·</span>
              <span>Made to last</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
              <Link href="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium uppercase tracking-widest rounded-sm"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 h-10 sm:h-11 border border-primary/40 text-primary hover:bg-secondary/80 hover:text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-widest rounded-sm transition-colors"
                >
                  Gifts
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2 relative w-full aspect-[4/3] lg:aspect-[5/4] min-h-[260px] max-h-[360px] sm:min-h-[320px] sm:max-h-[420px] lg:min-h-[560px] lg:max-h-[720px] rounded-sm overflow-hidden bg-transparent">
            <Image
              src="/hero-bixlay-models.png"
              alt="Bixlay premium clothing collection - models in athletic and casual wear"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
