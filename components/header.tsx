'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart-context'
import { useCustomerAuth } from '@/components/customer-auth-context'
import { useStoreProducts } from '@/hooks/use-store-products'

const navLinkClass = (pathname: string, href: string) => {
  const base = 'uppercase tracking-wide text-sm font-medium transition-colors'
  const isActive =
    href === '/products'
      ? pathname === '/products' || pathname.startsWith('/products/')
      : pathname === href || pathname.startsWith(href + '/')
  return `${base} ${isActive ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-foreground hover:text-primary'}`
}

const MAX_SEARCH_RESULTS = 20

export const Header = () => {
  const pathname = usePathname()
  const { openCart, itemCount } = useCart()
  const { user, loading: authLoading, signOut } = useCustomerAuth()
  const { products } = useStoreProducts()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileMenuRef = useRef<HTMLDetailsElement>(null)

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!q) return products.slice(0, MAX_SEARCH_RESULTS)
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, MAX_SEARCH_RESULTS)
  }, [products, q])

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

  useEffect(() => {
    if (!searchOpen) return
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (isMobile) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/bixlay-logo.png"
              alt="Bixlay"
              width={240}
              height={48}
              className="h-5 sm:h-6 w-auto object-contain"
              quality={95}
              priority
              sizes="(max-width: 640px) 80px, 96px"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className={navLinkClass(pathname, '/products')}>
              Shop
            </Link>
            <Link href="/new-arrivals" className={navLinkClass(pathname, '/new-arrivals')}>
              New Arrivals
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
                className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center touch-manipulation"
                aria-label="Open search"
              >
                <Search size={20} className="text-primary" />
              </button>

              {searchOpen && (
                <>
                  {/* Mobile: full-screen overlay with backdrop */}
                  <div
                    className="fixed inset-0 z-50 md:hidden bg-black/50"
                    aria-hidden
                    onClick={() => setSearchOpen(false)}
                  />
                  <div className="fixed inset-x-0 top-0 z-50 md:absolute md:inset-auto md:right-0 md:top-full md:mt-1 md:w-[min(90vw,400px)] max-h-[100dvh] md:max-h-[70vh] bg-background md:border md:border-border rounded-b-xl md:rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 p-2 border-b border-border shrink-0">
                      <Search size={18} className="text-muted-foreground shrink-0" />
                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 py-2.5 md:py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base md:text-sm"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="min-w-[44px] min-h-[44px] p-2 md:p-1.5 hover:bg-secondary rounded transition-colors touch-manipulation flex items-center justify-center"
                        aria-label="Close search"
                      >
                        <X size={20} className="md:w-[18px] md:h-[18px] text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      {results.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                          No products found
                        </p>
                      ) : (
                        <ul className="py-1">
                          {results.map((product) => {
                            const thumb = product.image_urls?.[0]
                            return (
                              <li key={product.id}>
                                <Link
                                  href={`/products/${product.id}`}
                                  onClick={() => {
                                    setSearchOpen(false)
                                    setQuery('')
                                  }}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary active:bg-secondary transition-colors text-left touch-manipulation"
                                >
                                  <div className="relative w-10 h-10 rounded bg-muted shrink-0 overflow-hidden">
                                    {thumb ? (
                                      <Image src={thumb} alt="" fill sizes="40px" className="object-cover" />
                                    ) : (
                                      <span className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">—</span>
                                    )}
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
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {!authLoading && (
              <>
                {user ? (
                  <Link
                    href="/account"
                    className="min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-1.5 text-foreground touch-manipulation"
                    aria-label="My account"
                  >
                    <User size={20} className="text-primary" />
                    <span className="hidden lg:inline text-sm font-medium">Account</span>
                  </Link>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/account/login"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/account/signup"
                      className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={openCart}
              className="relative min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center touch-manipulation"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} className="text-primary" />
              <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            </button>
            <details ref={mobileMenuRef} className="md:hidden group">
              <summary className="list-none min-w-[44px] min-h-[44px] p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer flex items-center justify-center touch-manipulation">
                <Menu size={20} className="text-primary" />
              </summary>
              <nav className="absolute top-full right-0 mt-1 mr-0 sm:mr-2 bg-background border border-border rounded-lg shadow-lg p-2 min-w-[200px] max-w-[min(280px,calc(100vw-2rem))]">
                <button
                  type="button"
                  onClick={() => {
                    mobileMenuRef.current?.removeAttribute('open')
                    setSearchOpen(true)
                  }}
                  className="flex items-center gap-2 w-full py-3 min-h-[44px] text-left text-foreground hover:text-primary font-medium uppercase tracking-wide text-sm touch-manipulation"
                >
                  <Search size={16} className="text-primary" />
                  Search
                </button>
                <Link
                  href="/products"
                  className={`block py-3 min-h-[44px] flex items-center touch-manipulation ${navLinkClass(pathname, '/products')}`}
                >
                  Shop
                </Link>
                <Link
                  href="/new-arrivals"
                  className={`block py-3 min-h-[44px] flex items-center touch-manipulation ${navLinkClass(pathname, '/new-arrivals')}`}
                >
                  New Arrivals
                </Link>
                <Link
                  href="/men"
                  className={`block py-3 min-h-[44px] flex items-center touch-manipulation ${navLinkClass(pathname, '/men')}`}
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  className={`block py-3 min-h-[44px] flex items-center touch-manipulation ${navLinkClass(pathname, '/women')}`}
                >
                  Women
                </Link>
                {!authLoading && (
                  <>
                    {user ? (
                      <>
                        <Link href="/account" className="block py-3 min-h-[44px] flex items-center text-foreground hover:text-primary touch-manipulation">
                          Account
                        </Link>
                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="flex items-center gap-2 w-full py-3 min-h-[44px] text-left text-foreground hover:text-primary touch-manipulation"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/account/login" className="block py-3 min-h-[44px] flex items-center text-foreground hover:text-primary touch-manipulation">
                          Sign in
                        </Link>
                        <Link href="/account/signup" className="block py-3 min-h-[44px] flex items-center text-foreground hover:text-primary touch-manipulation">
                          Create account
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}
