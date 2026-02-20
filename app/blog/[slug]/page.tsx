import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, ArrowLeft } from 'lucide-react'
import { blogPosts } from '@/lib/blog-posts'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const paragraphs = post.body.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary mb-4"
            >
              <ArrowLeft size={16} />
              Back to blog
            </Link>
            <time
              dateTime={post.date}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Calendar size={14} />
              {formatDate(post.date)}
            </time>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary mt-2">
              {post.title}
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl prose prose-neutral dark:prose-invert">
            {paragraphs.map((block, i) => {
              if (block.startsWith('**') && block.endsWith('**')) {
                return (
                  <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
                    {block.replace(/\*\*/g, '')}
                  </h2>
                )
              }
              return (
                <p key={i} className="text-foreground/90 leading-relaxed mb-4">
                  {block.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < block.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )
            })}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-primary font-medium mt-10 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
