import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

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
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/products" className="hover:opacity-100 transition-opacity">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=shirts" className="hover:opacity-100 transition-opacity">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=pants" className="hover:opacity-100 transition-opacity">
                  Pants
                </Link>
              </li>
              <li>
                <Link href="/products?category=dresses" className="hover:opacity-100 transition-opacity">
                  Dresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/about" className="hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:opacity-100 transition-opacity">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:opacity-100 transition-opacity">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/privacy" className="hover:opacity-100 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100 transition-opacity">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:opacity-100 transition-opacity">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-100 transition-opacity">
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
          <div className="flex items-center gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity opacity-80">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity opacity-80">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity opacity-80">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
