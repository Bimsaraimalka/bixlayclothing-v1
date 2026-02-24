/**
 * Verify admin session cookie (Edge-compatible - used in middleware).
 */
export async function verifyAdminSession(
  cookie: string,
  secret: string
): Promise<{ sub: string; role: string } | null> {
  const parts = cookie.split('.')
  if (parts.length !== 2) return null
  const [payloadStr, sigHex] = parts
  try {
    let base64 = payloadStr.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    if (pad) base64 += '='.repeat(4 - pad)
    const payloadJson = atob(base64)
    const payload = JSON.parse(payloadJson) as { sub: string; role: string; exp: number }
    if (payload.exp < Date.now() / 1000) return null
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const sigBuf = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payloadStr)
    )
    const expectedHex = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    if (sigHex !== expectedHex) return null
    return { sub: payload.sub, role: payload.role }
  } catch {
    return null
  }
}
