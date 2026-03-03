import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Lock Turbopack to this project dir so it doesn't read parent (fixes "reading dir Downloads" / page not loading) */
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /** Disable the dev indicator/overlay that injects nextjs-portal (avoids 0x0 portal in DOM during dev) */
  devIndicators: false,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
