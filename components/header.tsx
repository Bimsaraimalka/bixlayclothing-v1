'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { SEARCH_PRODUCTS } from '@/lib/search-products'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart-context'

const navLinkClass = (pathname: string, href: string) => {
  const base = 'uppercase tracking-wide text-sm font-medium transition-colors'
  const isActive =
    href === '/products'
      ? pathname === '/products' || pathname.startsWith('/products/')
      : pathname === href || pathname.startsWith(href + '/')
  return `${base} ${isActive ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-foreground hover:text-primary'}`
}

export const Header = () => {
  const pathname = usePathname()
  const { openCart, itemCount } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const q = query.trim().toLowerCase()
  const results = q
    ? SEARCH_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    : SEARCH_PRODUCTS

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    if (searchOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/bixlay-logo.png"
              alt="Bixlay"
              width={56}
              height={20}
              className="h-4 sm:h-5 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className={navLinkClass(pathname, '/products')}>
              Shop
            </Link>
            <Link href="/men" className={navLinkClass(pathname, '/men')}>
              Men
            </Link>
            <Link href="/women" className={navLinkClass(pathname, '/women')}>
              Women
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4" ref={searchRef}>
            {/* Search: click opens panel with input + real-time results */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchOpen(true)
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Open search"
              >
                <Search size={20} className="text-primary" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-1 w-[min(90vw,400px)] bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="flex items-center gap-2 p-2 border-b border-border">
                    <Search size={18} className="text-muted-foreground shrink-0" />
                    <input
                      ref={inputRef}
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1.5 hover:bg-secondary rounded transition-colors"
                      aria-label="Close search"
                    >
                      <X size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {results.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">
                        No products found
                      </p>
                    ) : (
                      <ul className="py-1">
                        {results.map((product) => (
                          <li key={product.id}>
                            <Link
                              href={`/products/${product.id}`}
                              onClick={() => {
                                setSearchOpen(false)
                                setQuery('')
                              }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                            >
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 text-muted-foreground text-xs">
                                Image
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground text-sm truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {product.category} · {formatPrice(product.price)}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openCart}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} className="text-primary" />
              <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            </button>
            <details className="md:hidden group">
              <summary className="list-none p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer">
                <Menu size={20} className="text-primary" />
              </summary>
              <nav className="absolute top-16 right-0 bg-background border border-border rounded-lg shadow-lg p-4 min-w-48">
                <Link
                  href="/products"
                  className={`block py-2 ${navLinkClass(pathname, '/products')}`}
                >
                  Shop
                </Link>
                <Link
                  href="/men"
                  className={`block py-2 ${navLinkClass(pathname, '/men')}`}
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  className={`block py-2 ${navLinkClass(pathname, '/women')}`}
                >
                  Women
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}
