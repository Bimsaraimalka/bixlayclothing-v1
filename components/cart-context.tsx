'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useCustomerAuth } from '@/components/customer-auth-context'
import {
  fetchCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCartItems,
} from '@/lib/supabase-data'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  /** Product image URL for cart/checkout display */
  image?: string
}

export interface AppliedPromo {
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
}

type CartContextValue = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  items: CartItem[]
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (id: string, delta: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  appliedPromo: AppliedPromo | null
  setAppliedPromo: (promo: AppliedPromo | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useCustomerAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [cartSyncLoading, setCartSyncLoading] = useState(false)
  const hasLoadedUserCart = useRef(false)
  const itemsRef = useRef<CartItem[]>(items)
  itemsRef.current = items

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const getLineKey = (item: CartItem) => `${item.id}-${item.size}-${item.color}`

  // When user is logged in: load cart from DB (and merge guest cart into DB on first load)
  useEffect(() => {
    if (!user?.id) {
      hasLoadedUserCart.current = false
      return
    }
    let cancelled = false
    setCartSyncLoading(true)
    const run = async () => {
      const localItems = itemsRef.current
      if (localItems.length > 0 && !hasLoadedUserCart.current) {
        for (const it of localItems) {
          await addCartItem({
            id: it.id,
            name: it.name,
            price: it.price,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
          })
        }
      }
      hasLoadedUserCart.current = true
      const dbItems = await fetchCartItems()
      if (!cancelled) setItems(dbItems)
      if (!cancelled) setCartSyncLoading(false)
    }
    run().catch(() => {
      if (!cancelled) setCartSyncLoading(false)
    })
    return () => { cancelled = true }
  }, [user?.id])

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity ?? 1
    const key = (i: CartItem) => `${i.id}-${i.size}-${i.color}`
    setItems((prev) => {
      const existing = prev.find((i) => key(i) === key({ ...newItem, quantity: 1 } as CartItem))
      if (existing) {
        const next = prev.map((i) =>
          key(i) === key(existing) ? { ...i, quantity: i.quantity + qty } : i
        )
        if (user?.id) {
          addCartItem({
            id: newItem.id,
            name: newItem.name,
            price: newItem.price,
            size: newItem.size,
            color: newItem.color,
            quantity: qty,
          }).catch(() => {})
        }
        return next
      }
      if (user?.id) {
        addCartItem({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          size: newItem.size,
          color: newItem.color,
          quantity: qty,
        }).catch(() => {})
      }
      return [...prev, { ...newItem, quantity: qty }]
    })
  }, [user?.id])

  const updateQuantity = useCallback((lineKey: string, delta: number) => {
    setItems((prev) => {
      const item = prev.find((i) => getLineKey(i) === lineKey)
      if (!item) return prev
      const nextQty = Math.max(1, item.quantity + delta)
      if (user?.id) {
        updateCartItemQuantity(item.id, item.size, item.color, delta).catch(() => {})
      }
      return prev.map((i) =>
        getLineKey(i) === lineKey ? { ...i, quantity: nextQty } : i
      )
    })
  }, [user?.id])

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => {
      const item = prev.find((i) => getLineKey(i) === lineKey)
      if (user?.id && item) {
        removeCartItem(item.id, item.size, item.color).catch(() => {})
      }
      return prev.filter((i) => getLineKey(i) !== lineKey)
    })
  }, [user?.id])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedPromo(null)
    if (user?.id) clearCartItems().catch(() => {})
  }, [user?.id])

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        items,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        appliedPromo,
        setAppliedPromo,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
