'use server'

/**
 * Sends a new-order notification to the admin's phone.
 * Supports Telegram (push to Telegram app) and optionally Twilio SMS.
 *
 * Set in .env.local:
 * - Telegram: ADMIN_TELEGRAM_BOT_TOKEN and ADMIN_TELEGRAM_CHAT_ID
 * - SMS (Twilio): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ADMIN_PHONE_NUMBER
 */

type NewOrderPayload = {
  id: string
  customer: string
  email: string
  amount: string
  payment_method?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
}

function paymentLabel(method: string | null | undefined): string {
  if (!method) return '—'
  switch (method) {
    case 'bank_transfer': return 'Bank transfer'
    case 'card': return 'Card'
    case 'cash_on_delivery': return 'Cash on delivery'
    default: return method
  }
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.ADMIN_TELEGRAM_BOT_TOKEN
  const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID
  if (!token?.trim() || !chatId?.trim()) return false
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token.trim()}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text,
          disable_web_page_preview: true,
        }),
      }
    )
    return res.ok
  } catch {
    return false
  }
}

async function sendTwilioSms(body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_FROM_NUMBER
  const toNumber = process.env.ADMIN_PHONE_NUMBER
  if (!accountSid?.trim() || !authToken?.trim() || !fromNumber?.trim() || !toNumber?.trim())
    return false
  try {
    const auth = Buffer.from(`${accountSid.trim()}:${authToken.trim()}`).toString('base64')
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid.trim()}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          To: toNumber.trim(),
          From: fromNumber.trim(),
          Body: body,
        }),
      }
    )
    return res.ok
  } catch {
    return false
  }
}

export async function sendNewOrderNotification(order: NewOrderPayload): Promise<void> {
  const addr = [order.address, order.city, order.state, order.zip_code, order.country].filter(Boolean).join(', ')
  const lines = [
    '🛒 New order',
    '',
    `Order: ${order.id}`,
    `Customer: ${order.customer}`,
    `Email: ${order.email}`,
    order.phone ? `Phone: ${order.phone}` : null,
    addr ? `Address: ${addr}` : null,
    '',
    `Amount: ${order.amount}`,
    `Payment: ${paymentLabel(order.payment_method)}`,
  ].filter(Boolean) as string[]
  const fullText = lines.join('\n')
  const shortText = `New order ${order.id} – ${order.customer} – ${order.amount}${order.phone ? ` – ${order.phone}` : ''}`

  await Promise.all([
    sendTelegram(fullText),
    sendTwilioSms(shortText),
  ])
}
