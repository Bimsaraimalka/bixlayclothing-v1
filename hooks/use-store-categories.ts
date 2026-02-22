'use client'

import { useState, useEffect } from 'react'
import { fetchProductCategories } from '@/lib/supabase-data'

/** Category names for storefront filter; from DB or empty. */
export function useStoreCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProductCategories()
      .then((list) => {
        if (!cancelled) setCategories(list.map((c) => c.name))
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { categories, loading }
}
