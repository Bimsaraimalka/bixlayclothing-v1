'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Share2, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice } from '@/lib/utils'
import { useStoreProduct } from '@/hooks/use-store-products'
import { LoadingScreen } from '@/components/loading-screen'

const DEFAULT_DETAILS = [
  'Premium materials',
  'Comfortable fit',
  'Quality craftsmanship',
  'Versatile styling',
]

/** Map color name to CSS background (hex) for the color swatch dot. */
const COLOR_SWATCH: Record<string, string> = {
  black: '#1a1a1a',
  white: '#f5f5f5',
  navy: '#1e3a5f',
  blue: '#2563eb',
  'dark blue': '#1e3a5f',
  'light blue': '#93c5fd',
  gray: '#6b7280',
  grey: '#6b7280',
  red: '#dc2626',
  pink: '#ec4899',
  beige: '#d4b896',
  cream: '#fef7ed',
  brown: '#78350f',
  green: '#16a34a',
  olive: '#65743a',
  yellow: '#eab308',
  orange: '#ea580c',
  purple: '#7c3aed',
  lavender: '#c4b5fd',
  mint: '#99f6e4',
  burgundy: '#722f37',
  charcoal: '#374151',
  khaki: '#c3b091',
  tan: '#d2b48c',
}

function getColorSwatchStyle(colorName: string): React.CSSProperties {
  const key = colorName.trim().toLowerCase()
  const hex = COLOR_SWATCH[key] ?? (key.startsWith('#') ? key : '#9ca3af')
  return { backgroundColor: hex }
}

function getColorHex(colorName: string): string {
  const key = colorName.trim().toLowerCase()
  return COLOR_SWATCH[key] ?? (key.startsWith('#') ? key : '#9ca3af')
}

export function ProductDetail({ productId }: { productId: string }) {
  const pathname = usePathname()
  const { addItem, openCart } = useCart()
  const { product, loading, error } = useStoreProduct(productId)

  const colors = product?.colors ?? []
  const sizes = product?.sizes ?? []
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [shareFeedback, setShareFeedback] = useState<'copied' | 'shared' | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (product) {
      setSelectedColor(colors[0] ?? '')
      setSelectedSize(sizes[0] ?? '')
    }
  }, [product, colors, sizes])

  const displayImages =
    product?.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : ['/hero-bixlay-models.png']

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      size: (selectedSize || sizes[0]) ?? '',
      color: (selectedColor || colors[0]) ?? '',
      quantity,
      imageUrl: displayImages[0],
    })
    openCart()
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : ''
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          url,
          title: product?.name ?? 'Product',
          text: product?.name ?? 'Check out this product',
        })
        setShareFeedback('shared')
      } else {
        await navigator.clipboard.writeText(url)
        setShareFeedback('copied')
      }
      setTimeout(() => setShareFeedback(null), 2000)
    } catch {
      setShareFeedback(null)
    }
  }

  if (loading) {
    return <LoadingScreen variant="productDetail" />
  }
  if (error || !product) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{error ?? 'Product not found.'}</p>
        <Link href="/products" className="text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-')
  const details =
    product.details && product.details.length > 0 ? product.details : DEFAULT_DETAILS
  const previewImages = displayImages

  return (
    <div>
      <nav className="flex justify-start mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight size={14} className="text-muted-foreground/70" />
            <Link href="/products" className="hover:text-primary transition-colors">
              Shop
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight size={14} className="text-muted-foreground/70" />
            <Link href={`/products?category=${categorySlug}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight size={14} className="text-muted-foreground/70" />
            <span className="text-foreground font-medium truncate max-w-[180px] sm:max-w-none" aria-current="page">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] max-h-[380px] sm:max-h-[420px] rounded-lg bg-muted overflow-hidden">
            <Image
              src={previewImages[selectedImageIndex]}
              alt={`${product.name} – view ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {previewImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((i) => (i === 0 ? previewImages.length - 1 : i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 hover:bg-background shadow-md border border-border flex items-center justify-center text-foreground transition-colors touch-manipulation z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((i) => (i === previewImages.length - 1 ? 0 : i + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 hover:bg-background shadow-md border border-border flex items-center justify-center text-foreground transition-colors touch-manipulation z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pt-2 pb-2 px-2 -mx-2">
            {previewImages.map((src, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 min-w-[44px] min-h-[44px] rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                  selectedImageIndex === index
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-border hover:border-primary'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-primary">{product.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Product ID: {product.id}</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{formatPrice(product.price)}</p>
          </div>

          {colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Color: <span className="text-muted-foreground">{(selectedColor || colors[0]) ?? ''}</span>
              </label>
              <div className="flex gap-1.5 sm:gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={getColorSwatchStyle(color)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 min-w-[44px] min-h-[44px] rounded-full border-2 transition-all shrink-0 touch-manipulation flex items-center justify-center ${
                      selectedColor === color
                        ? 'ring-2 ring-primary ring-offset-1 border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                    title={color}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Size: <span className="text-accent">{selectedSize || sizes[0]}</span>
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 sm:py-2.5 px-3 min-h-[44px] min-w-[44px] rounded-lg border-2 font-medium transition-all text-center text-xs sm:text-sm touch-manipulation ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">Quantity</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="min-w-[44px] min-h-[44px] px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm touch-manipulation flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-sm sm:text-base font-bold w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="min-w-[44px] min-h-[44px] px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm touch-manipulation flex items-center justify-center"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all flex items-center justify-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  Added to Cart
                </>
              ) : product.stock < 1 ? (
                'Out of stock'
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="min-w-[48px] min-h-[48px] p-3 rounded-lg border border-border hover:bg-secondary transition-colors relative shrink-0 touch-manipulation flex items-center justify-center"
              title="Copy link to share"
              aria-label="Copy link to share"
            >
              <Share2 size={16} className="text-primary" />
              {shareFeedback && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap">
                  {shareFeedback === 'shared' ? 'Shared' : 'Link copied'}
                </span>
              )}
            </button>
          </div>

          <div className="border-t border-border pt-4 sm:pt-5">
            <h3 className="font-semibold text-foreground mb-2 text-xs sm:text-sm">Product Details</h3>
            <ul className="space-y-1.5">
              {details.map((detail, i) => (
                <li key={i} className="flex items-center gap-1.5 text-foreground/80 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 border-t border-border pt-4 sm:pt-5">
            <div className="flex items-start gap-2">
              <span className="text-accent text-sm">✓</span>
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over Rs. 5,000</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent text-sm">✓</span>
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent text-sm">✓</span>
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">Quality Guaranteed</p>
                <p className="text-xs text-muted-foreground">Premium materials and craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
