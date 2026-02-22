'use client'

import { useState, useEffect } from 'react'
import { fetchProductImageUrls } from '@/lib/supabase-data'

type CartItem = { id: string }

/** Fetches product image URLs from the database for cart items. */
export function useCartProductImages(items: CartItem[]): Record<string, string> {
  const [imageMap, setImageMap] = useState<Record<string, string>>({})

  const ids = items.map((i) => i.id).filter(Boolean)

  useEffect(() => {
    if (ids.length === 0) {
      setImageMap({})
      return
    }
    let cancelled = false
    fetchProductImageUrls(ids)
      .then((map) => {
        if (!cancelled) setImageMap(map)
      })
      .catch(() => {
        if (!cancelled) setImageMap({})
      })
    return () => { cancelled = true }
  }, [ids.join(',')])

  return imageMap
}
