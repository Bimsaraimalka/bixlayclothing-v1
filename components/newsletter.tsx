import { Button } from '@/components/ui/button'

export const Newsletter = () => {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16 bg-secondary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary">
            Stay Updated
          </h2>
          <p className="text-base sm:text-lg text-foreground/70">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
