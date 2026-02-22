'use client'

import { CartProvider } from '@/components/cart-context'
import { CartDrawer } from '@/components/cart-drawer'

export function CartProviderWithDrawer({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
