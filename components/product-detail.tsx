'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Share2, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

const PRODUCT_DATA: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Classic T-Shirt',
    price: 29.99,
    category: 'Shirts',
    colors: ['Black', 'White', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A timeless wardrobe staple. Our Classic T-Shirt is crafted from premium cotton for comfort and durability. Perfect for any occasion, dress it up or down with ease.',
    details: [
      '100% organic cotton',
      'Pre-shrunk and colorfast',
      'Comfortable crew neck',
      'Versatile classic style',
    ],
    rating: 4.8,
    reviews: 124,
  },
  '2': {
    id: '2',
    name: 'Denim Jeans',
    price: 79.99,
    category: 'Pants',
    colors: ['Dark Blue', 'Light Blue'],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Premium denim jeans with the perfect fit. Made from high-quality denim fabric, these jeans offer both style and comfort for everyday wear.',
    details: [
      'Premium denim fabric',
      'Perfect fit design',
      'Durable stitching',
      'Versatile styling options',
    ],
    rating: 4.9,
    reviews: 256,
  },
  '3': {
    id: '3',
    name: 'Summer Dress',
    price: 49.99,
    category: 'Dresses',
    colors: ['Pink', 'Yellow', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Light and breathable summer dress perfect for warm weather. This dress combines style and comfort for those hot days.',
    details: [
      'Lightweight breathable fabric',
      'Perfect for summer',
      'Versatile styling',
      'Comfortable fit',
    ],
    rating: 4.7,
    reviews: 98,
  },
}

export function ProductDetail({ productId }: { productId: string }) {
  const pathname = usePathname()
  const product = PRODUCT_DATA[productId] || PRODUCT_DATA['1']
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Multiple preview images (use real URLs when available)
  const previewImages = [
    '/hero-bixlay-models.png',
    '/hero-bixlay-models.png',
    '/hero-bixlay-models.png',
  ]

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : ''
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      setShareCopied(false)
    }
  }

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      {/* Breadcrumb - top right */}
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
        {/* Product images – main preview + thumbnail strip */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative w-full aspect-[4/3] max-h-[380px] sm:max-h-[420px] rounded-lg bg-muted overflow-hidden">
            <Image
              src={previewImages[selectedImageIndex]}
              alt={`${product.name} – view ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Thumbnail strip – click to change main image */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {previewImages.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
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

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-primary">{product.name}</h1>
            <p className="text-lg sm:text-xl font-bold text-foreground">{formatPrice(product.price)}</p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Color
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-primary ring-2 ring-primary ring-offset-1'
                      : 'border-border hover:border-primary'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Size: <span className="text-accent">{selectedSize}</span>
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 sm:py-2 px-2.5 min-w-0 max-w-[3.5rem] rounded-lg border-2 font-medium transition-all text-center text-xs sm:text-sm ${
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

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">Quantity</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 sm:px-3 py-1.5 border border-border rounded-lg hover:bg-secondary transition-colors min-w-[2rem] text-sm"
              >
                −
              </button>
              <span className="text-sm sm:text-base font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 sm:px-3 py-1.5 border border-border rounded-lg hover:bg-secondary transition-colors min-w-[2rem] text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 sm:p-3 rounded-lg border border-border hover:bg-secondary transition-colors relative shrink-0"
              title="Copy link"
              aria-label="Copy link"
            >
              <Share2 size={16} className="text-primary" />
              {shareCopied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap">
                  Link copied
                </span>
              )}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-border pt-4 sm:pt-5">
            <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-xs sm:text-sm">Product Details</h3>
            <ul className="space-y-1.5">
              {product.details.map((detail: string, i: number) => (
                <li key={i} className="flex items-center gap-1.5 text-foreground/80 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping & Returns */}
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
