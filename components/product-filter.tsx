'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function ProductFilter() {
  const [expandedSection, setExpandedSection] = useState<string | null>('category')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          Category
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              expandedSection === 'category' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'category' && (
          <div className="mt-4 space-y-3">
            {['Shirts', 'Pants', 'Dresses', 'Hoodies', 'Jackets', 'Shoes', 'Sweaters'].map(
              (category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-background"
                  />
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </span>
                </label>
              )
            )}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          Price
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              expandedSection === 'price' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'price' && (
          <div className="mt-4 space-y-3">
            {[
              { label: 'Under Rs. 2,500', value: '0-2500' },
              { label: 'Rs. 2,500 – Rs. 5,000', value: '2500-5000' },
              { label: 'Rs. 5,000 – Rs. 10,000', value: '5000-10000' },
              { label: 'Rs. 10,000+', value: '10000+' },
            ].map(({ label, value }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background"
                />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          Size
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              expandedSection === 'size' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'size' && (
          <div className="mt-4 space-y-3">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <label key={size} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background"
                />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {size}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="pb-4 sm:pb-6">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          Color
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              expandedSection === 'color' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'color' && (
          <div className="mt-4 space-y-3">
            {['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue'].map((color) => (
              <label key={color} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background"
                />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {color}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button className="w-full py-2.5 sm:py-3 px-4 rounded-lg border border-border text-primary font-medium hover:bg-secondary transition-colors text-sm sm:text-base">
        Clear Filters
      </button>
    </div>
  )
}
