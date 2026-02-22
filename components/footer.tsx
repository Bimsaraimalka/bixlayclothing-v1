import Link from 'next/link'
import { Facebook, Instagram, Music2 } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 py-10 sm:py-14 lg:py-16">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif font-bold">Bixlay</h3>
            <p className="text-xs sm:text-sm opacity-80">
              Premium clothing for the modern individual. Quality, style, and comfort in every piece.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Shop</h4>
            <ul className="space-y-0 text-sm opacity-80">
              <li>
                <Link href="/products" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/men" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Men
                </Link>
              </li>
              <li className="py-1.5 border-t border-primary-foreground/20 my-1.5" aria-hidden />
              <li>
                <Link href="/women" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Women
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Company</h4>
            <ul className="space-y-0 text-sm opacity-80">
              <li>
                <Link href="/about" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Legal</h4>
            <ul className="space-y-0 text-sm opacity-80">
              <li>
                <Link href="/privacy" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="block py-3 min-h-[44px] flex items-center -my-1 hover:opacity-100 transition-opacity touch-manipulation">
                  Return & Exchange Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm opacity-80">
            &copy; {currentYear} Bixlay. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-1">
            <a
              href="https://www.facebook.com/share/1P9EusG3E2/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:opacity-100 transition-opacity opacity-80 touch-manipulation"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/bixlay_clothing?igsh=MTF5MTh4cno4M3lo&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:opacity-100 transition-opacity opacity-80 touch-manipulation"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a href="#" className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:opacity-100 transition-opacity opacity-80 touch-manipulation" aria-label="TikTok" title="TikTok">
              <Music2 size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
