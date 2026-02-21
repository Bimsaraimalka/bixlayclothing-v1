import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetail } from '@/components/product-detail'
import { RelatedProducts } from '@/components/related-products'
import { fetchProductById } from '@/lib/supabase-data'
import { SITE_NAME, BASE_URL } from '@/lib/site'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProductById(id)
  if (!product) return { title: 'Product not found' }
  const title = `${product.name} | ${SITE_NAME}`
  const description =
    product.details && product.details.length > 0
      ? product.details.join(' · ')
      : `${product.name} – ${product.category}. Premium quality.`
  const image =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : BASE_URL ? `${BASE_URL}/og-image.png` : '/og-image.png'
  return {
    title: product.name,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <ProductDetail productId={id} />
        </div>
        <div className="bg-secondary py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RelatedProducts excludeProductId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
