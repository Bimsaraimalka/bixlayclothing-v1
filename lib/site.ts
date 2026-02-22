/**
 * Site-wide config for SEO, sitemap, and Open Graph URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://bixlay.com).
 */
export const SITE_NAME = 'Bixlay'
export const SITE_DESCRIPTION =
  'Bixlay is a premium clothing company. Discover refined, high-quality apparel for every occasion.'

export const BASE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL.trim()
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : undefined

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (BASE_URL) return `${BASE_URL}${p}`
  return p
}
