'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AdminProduct, AdminOrder, ProductTemplate, ProductCategory } from '@/lib/admin-data'
import { parseAmount } from '@/lib/admin-data'
import {
  fetchProducts,
  fetchOrders,
  fetchProductTemplates,
  fetchProductCategories,
  addProductSupabase,
  updateProductSupabase,
  removeProductSupabase,
  addProductTemplateSupabase,
  removeProductTemplateSupabase,
  addProductCategorySupabase,
  updateProductCategorySupabase,
  removeProductCategorySupabase,
  addOrderSupabase,
  updateOrderStatusSupabase,
} from '@/lib/supabase-data'

const ORDER_STATUSES = ['Pending', 'Shipped', 'Completed', 'Returned', 'Cancelled'] as const

type AdminDataContextType = {
  products: AdminProduct[]
  orders: AdminOrder[]
  productTemplates: ProductTemplate[]
  productCategories: ProductCategory[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  refetchTemplates: () => Promise<void>
  refetchCategories: () => Promise<void>
  addProduct: (p: Omit<AdminProduct, 'id' | 'status'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<AdminProduct>) => Promise<void>
  removeProduct: (id: string) => Promise<void>
  addProductTemplate: (t: Omit<ProductTemplate, 'id'>) => Promise<void>
  removeProductTemplate: (id: string) => Promise<void>
  addProductCategory: (name: string) => Promise<void>
  updateProductCategory: (id: string, updates: { name?: string; sort_order?: number }) => Promise<void>
  removeProductCategory: (id: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
  totalRevenue: number
  totalOrders: number
  orderStatuses: readonly string[]
}

const AdminDataContext = createContext<AdminDataContextType | null>(null)

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [productsData, ordersData, templatesData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchProductTemplates(),
        fetchProductCategories(),
      ])
      setProducts(productsData)
      setOrders(ordersData)
      setProductTemplates(templatesData)
      setProductCategories(categoriesData)
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : 'Failed to load data'
      setError(message)
      setProducts([])
      setOrders([])
      setProductTemplates([])
      setProductCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refetchTemplates = useCallback(async () => {
    try {
      const data = await fetchProductTemplates()
      setProductTemplates(data)
    } catch {
      setProductTemplates([])
    }
  }, [])

  const refetchCategories = useCallback(async () => {
    try {
      const data = await fetchProductCategories()
      setProductCategories(data)
    } catch {
      setProductCategories([])
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const addProduct = useCallback(async (p: Omit<AdminProduct, 'id' | 'status'>) => {
    setError(null)
    await addProductSupabase(p)
    await refetch()
  }, [refetch])

  const updateProduct = useCallback(async (id: string, updates: Partial<AdminProduct>) => {
    setError(null)
    await updateProductSupabase(id, updates)
    await refetch()
  }, [refetch])

  const removeProduct = useCallback(async (id: string) => {
    setError(null)
    await removeProductSupabase(id)
    await refetch()
  }, [refetch])

  const addProductTemplate = useCallback(async (t: Omit<ProductTemplate, 'id'>) => {
    setError(null)
    await addProductTemplateSupabase(t)
    await refetchTemplates()
  }, [refetchTemplates])

  const removeProductTemplate = useCallback(async (id: string) => {
    setError(null)
    await removeProductTemplateSupabase(id)
    await refetchTemplates()
  }, [refetchTemplates])

  const addProductCategory = useCallback(async (name: string) => {
    setError(null)
    await addProductCategorySupabase(name)
    await refetchCategories()
  }, [refetchCategories])

  const updateProductCategory = useCallback(async (id: string, updates: { name?: string; sort_order?: number }) => {
    setError(null)
    await updateProductCategorySupabase(id, updates)
    await refetchCategories()
  }, [refetchCategories])

  const removeProductCategory = useCallback(async (id: string) => {
    setError(null)
    await removeProductCategorySupabase(id)
    await refetchCategories()
  }, [refetchCategories])

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    setError(null)
    await updateOrderStatusSupabase(orderId, status)
    await refetch()
  }, [refetch])

  const totalRevenue = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + parseAmount(o.amount), 0)

  const totalOrders = orders.length

  const value: AdminDataContextType = {
    products,
    orders,
    productTemplates,
    productCategories,
    loading,
    error,
    refetch,
    refetchTemplates,
    refetchCategories,
    addProduct,
    updateProduct,
    removeProduct,
    addProductTemplate,
    removeProductTemplate,
    addProductCategory,
    updateProductCategory,
    removeProductCategory,
    updateOrderStatus,
    totalRevenue,
    totalOrders,
    orderStatuses: ORDER_STATUSES,
  }

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
