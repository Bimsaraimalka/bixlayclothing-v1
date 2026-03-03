import { NextResponse } from 'next/server'

const ADMIN_SESSION_COOKIE = 'admin_session'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // Clear the cookie using same path/options as login so the browser removes it reliably
  res.cookies.set(ADMIN_SESSION_COOKIE, '', {
    path: '/admin',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    expires: new Date(0),
  })
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  return res
}
