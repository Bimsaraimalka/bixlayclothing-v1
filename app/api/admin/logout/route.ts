import { NextResponse } from 'next/server'

const ADMIN_SESSION_COOKIE = 'admin_session'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, '', {
    path: '/admin',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })
  return res
}
