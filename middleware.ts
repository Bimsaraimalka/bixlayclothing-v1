import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session-verify'

const ADMIN_LOGIN = '/admin/login'
const ADMIN_SESSION_COOKIE = 'admin_session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === ADMIN_LOGIN) return NextResponse.next()

  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return NextResponse.next()
  if (!cookie) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url))
  }
  const session = await verifyAdminSession(cookie, secret)
  if (!session) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
