import { NextRequest, NextResponse } from 'next/server'
import { fetchOrderByNumericId, updateOrderStatusSupabase } from '@/lib/supabase-data'
import { verifyPayzyCallback } from '@/lib/payzy'
import { sendNewOrderNotification } from '@/app/actions/notify-new-order'

export const dynamic = 'force-dynamic'

/** Payzy redirects here after payment with ?x_order_id=&response_code=&signature= */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const xOrderId = searchParams.get('x_order_id')
  const responseCode = searchParams.get('response_code')
  const signature = searchParams.get('signature')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL}`
    : ''
  const responseUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/payzy/return` : ''
  const successPath = '/checkout/success'

  const origin = baseUrl ? baseUrl.replace(/\/$/, '') : request.nextUrl.origin
  const checkoutUrl = `${origin}/checkout`

  if (!xOrderId || !responseCode || !signature) {
    return NextResponse.redirect(`${checkoutUrl}?payzy=missing`)
  }

  const numericId = parseInt(xOrderId, 10)
  if (Number.isNaN(numericId)) {
    return NextResponse.redirect(`${checkoutUrl}?payzy=invalid`)
  }

  const order = await fetchOrderByNumericId(numericId)
  if (!order) {
    return NextResponse.redirect(`${checkoutUrl}?payzy=notfound`)
  }

  const payzyAmount = order.payzy_amount != null ? String(order.payzy_amount) : order.amount.replace(/Rs\.?\s*/i, '').replace(/,/g, '').trim() || '0'
  const payzyFreight = order.payzy_freight != null ? String(order.payzy_freight) : '0'

  const [firstName, ...lastParts] = (order.customer || ' ').trim().split(/\s+/)
  const lastName = lastParts.join(' ') || ''

  const shopId = process.env.PAYZY_SHOP_ID ?? ''
  const secretKey = process.env.PAYZY_SECRET_KEY ?? ''
  const testMode = process.env.PAYZY_TEST_MODE === 'true'

  const { valid, responseCode: code } = verifyPayzyCallback({
    response_code: responseCode,
    x_order_id: xOrderId,
    signature,
    shopId,
    secretKey,
    testMode,
    amount: payzyAmount,
    responseUrl,
    firstName,
    lastName,
    address: order.address ?? undefined,
    country: order.country ?? 'Sri Lanka',
    state: order.state ?? undefined,
    city: order.city ?? undefined,
    zip: order.zip_code ?? undefined,
    phone: order.phone ?? undefined,
    email: order.email,
    freight: payzyFreight,
  })

  const displayId = `#ORD-${String(numericId).padStart(3, '0')}`

  if (!valid) {
    return NextResponse.redirect(`${checkoutUrl}?payzy=invalid_signature`)
  }

  if (code === '00') {
    await updateOrderStatusSupabase(displayId, 'Completed')
    sendNewOrderNotification({
      id: displayId,
      customer: order.customer,
      email: order.email,
      amount: order.amount,
      payment_method: 'payzy',
      phone: order.phone ?? null,
      address: order.address ?? null,
      city: order.city ?? null,
      state: order.state ?? null,
      zip_code: order.zip_code ?? null,
      country: order.country ?? null,
    }).catch(() => {})
    return NextResponse.redirect(`${origin}${successPath}?order=${encodeURIComponent(displayId)}`)
  }

  if (code === '10') {
    await updateOrderStatusSupabase(displayId, 'Cancelled')
    return NextResponse.redirect(`${checkoutUrl}?payzy=failed`)
  }

  await updateOrderStatusSupabase(displayId, 'Cancelled')
  return NextResponse.redirect(`${checkoutUrl}?payzy=error`)
}
