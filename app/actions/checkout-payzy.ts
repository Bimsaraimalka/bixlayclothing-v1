'use server'

import { addOrderWithItems, updateOrderPayzyMeta } from '@/lib/supabase-data'
import { buildPayzyCheckoutParams, getPayzyProcessUrl } from '@/lib/payzy'
import { formatPrice } from '@/lib/utils'
import type { PaymentMethod } from '@/components/checkout-form'

export type PayzyRedirectResult =
  | { ok: true; orderId: string; formAction: string; formFields: Record<string, string> }
  | { ok: false; error: string }

function parseOrderNumericId(displayId: string): number | null {
  const match = displayId.replace(/^#ORD-0*/, '').replace(/^ORD-0*/, '')
  const n = parseInt(match, 10)
  return Number.isNaN(n) ? null : n
}

/**
 * Create order with payment_method payzy and return form data to redirect to Payzy.
 * Client should POST the form to formAction with formFields as hidden inputs.
 */
export async function createOrderAndGetPayzyRedirect(options: {
  orderPayload: {
    customer: string
    email: string
    amount: string
    status: string
    date: string
    promo_code: string | null
    payment_method: PaymentMethod
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    country: string
  }
  orderItems: Array<{
    product_id: string
    product_name: string
    color: string | null
    size: string | null
    quantity: number
    unit_price: number
    discount_amount: number
  }>
  /** Numeric total in LKR for Payzy */
  totalAmount: number
  shippingTotal: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}): Promise<PayzyRedirectResult> {
  const shopId = process.env.PAYZY_SHOP_ID
  const secretKey = process.env.PAYZY_SECRET_KEY
  const testMode = process.env.PAYZY_TEST_MODE === 'true'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL}`
    : ''

  if (!shopId?.trim() || !secretKey?.trim()) {
    return { ok: false, error: 'Payzy is not configured. Set PAYZY_SHOP_ID and PAYZY_SECRET_KEY.' }
  }
  if (!baseUrl) {
    return { ok: false, error: 'App URL not set. Set NEXT_PUBLIC_APP_URL or VERCEL_URL.' }
  }

  const responseUrl = `${baseUrl.replace(/\/$/, '')}/api/payzy/return`

  const order = await addOrderWithItems(
    { ...options.orderPayload, payment_method: 'payzy' },
    options.orderItems
  )

  await updateOrderPayzyMeta(order.id, options.totalAmount, options.shippingTotal)

  const numericId = parseOrderNumericId(order.id)
  if (numericId == null) {
    return { ok: false, error: 'Invalid order id' }
  }

  const formFields = buildPayzyCheckoutParams({
    shopId,
    secretKey,
    testMode,
    amount: options.totalAmount,
    orderId: numericId,
    responseUrl,
    firstName: options.firstName,
    lastName: options.lastName,
    address: options.address || undefined,
    country: options.country || 'Sri Lanka',
    state: options.state || undefined,
    city: options.city || undefined,
    zip: options.zipCode || undefined,
    phone: options.phone || undefined,
    email: options.email,
    freight: options.shippingTotal,
  })

  const formAction = getPayzyProcessUrl(testMode)
  return {
    ok: true,
    orderId: order.id,
    formAction,
    formFields,
  }
}
