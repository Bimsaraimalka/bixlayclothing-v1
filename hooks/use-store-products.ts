'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { fetchProducts, fetchProductById } from '@/lib/supabase-data'
import type { AdminProduct } from '@/lib/admin-data'

export function useStoreProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  // Subscribe to realtime product updates (e.g. price changes from admin)
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('products-list')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        () => {
          refetch()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  return { products, loading, error, refetch }
}

export function useStoreProduct(id: string | null) {
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return
    setError(null)
    try {
      const data = await fetchProductById(id)
      setProduct(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) {
      setProduct(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load product')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  // Subscribe to realtime updates for this product (e.g. price changes from admin)
  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    const channel = supabase
      .channel(`product-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${id}` },
        () => {
          refetch()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, refetch])

  return { product, loading, error }
}
