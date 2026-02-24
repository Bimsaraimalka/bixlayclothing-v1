import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session-verify'

const ADMIN_SESSION_COOKIE = 'admin_session'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !cookie) {
    return NextResponse.json({ role: null }, { status: 200 })
  }
  const session = await verifyAdminSession(cookie, secret)
  if (!session) {
    return NextResponse.json({ role: null }, { status: 200 })
  }
  return NextResponse.json({ role: session.role })
}
