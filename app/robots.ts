import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = BASE_URL ?? 'https://bixlay.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
