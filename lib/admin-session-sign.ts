/**
 * Sign admin session payload (Node only - used in API routes).
 * Cookie value = base64url(payload) + '.' + hex(HMAC-SHA256(secret, base64url(payload)))
 */
export function signAdminSession(
  payload: { sub: string; role: string; exp: number },
  secret: string
): string {
  const crypto = require('crypto') as typeof import('crypto')
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex')
  return `${payloadStr}.${sig}`
}
