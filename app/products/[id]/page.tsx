import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetail } from '@/components/product-detail'
import { RelatedProducts } from '@/components/related-products'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <ProductDetail productId={params.id} />
        </div>
        <div className="bg-secondary py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RelatedProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
