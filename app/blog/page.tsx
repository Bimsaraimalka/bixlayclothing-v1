import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar } from 'lucide-react'
import { blogPosts } from '@/lib/blog-posts'

export const metadata = {
  title: 'Blog',
  description: 'Bixlay blog – style tips, brand updates, and stories from the world of Bixlay.',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
              Blog
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mt-1.5 sm:mt-2">
              Style tips, brand updates, and stories from Bixlay
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <p className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
            From care guides to styling ideas and behind-the-scenes updates – find it all here on the Bixlay blog.
          </p>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-5 sm:p-6">
                  <time
                    dateTime={post.date}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3"
                  >
                    <Calendar size={14} />
                    {formatDate(post.date)}
                  </time>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-2 group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-foreground/80 text-sm sm:text-base line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-medium text-sm hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mt-10">
            More posts coming soon. Have an idea? Email us at{' '}
            <a href="mailto:hello@bixlay.com" className="text-primary hover:underline">
              hello@bixlay.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
