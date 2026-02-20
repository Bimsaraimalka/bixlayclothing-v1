'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
}

const MOCK_CART: CartItem[] = [
  { id: '1', name: 'Classic T-Shirt', price: 29.99, quantity: 2, size: 'M', color: 'Black' },
  { id: '2', name: 'Denim Jeans', price: 79.99, quantity: 1, size: '32', color: 'Dark Blue' },
]

type CartContextValue = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  items: CartItem[]
  itemCount: number
  updateQuantity: (id: string, delta: number) => void
  removeItem: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>(MOCK_CART)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        items,
        itemCount,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
