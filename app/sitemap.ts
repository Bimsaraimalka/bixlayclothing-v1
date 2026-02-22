import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site'
import { fetchProducts } from '@/lib/supabase-data'
import { blogPosts } from '@/lib/blog-posts'

const STATIC_ROUTES = [
  '',
  '/products',
  '/men',
  '/women',
  '/new-arrivals',
  '/cart',
  '/checkout',
  '/about',
  '/contact',
  '/blog',
  '/careers',
  '/shipping',
  '/returns',
  '/privacy',
  '/terms',
  '/account/login',
  '/account/signup',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BASE_URL ?? 'https://bixlay.com'

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/products' ? 'daily' : path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await fetchProducts()
    productEntries = products.map((p) => ({
      url: `${base}/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Supabase may not be configured at build time; static + blog still work
  }

  return [...staticEntries, ...blogEntries, ...productEntries]
}
