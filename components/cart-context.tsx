'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity ?? 1
    setItems((prev) => {
      const key = (i: CartItem) => `${i.id}-${i.size}-${i.color}`
      const existing = prev.find((i) => key(i) === key({ ...newItem, quantity: 1 } as CartItem))
      if (existing) {
        return prev.map((i) =>
          key(i) === key(existing) ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...newItem, quantity: qty }]
    })
  }, [])

  const getLineKey = (item: CartItem) => `${item.id}-${item.size}-${item.color}`

  const updateQuantity = useCallback((lineKey: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        getLineKey(item) === lineKey
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }, [])

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((item) => getLineKey(item) !== lineKey))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedPromo(null)
  }, [])

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
