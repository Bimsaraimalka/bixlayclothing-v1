import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session-verify'
import { createServiceRoleClient } from '@/lib/supabase'

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
  // If session says admin but user is owner@bixlay.com, treat as owner (fixes stale cookies)
  let role = session.role
  if (role === 'admin' && session.sub && session.sub !== 'legacy') {
    try {
      const supabase = createServiceRoleClient()
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('email')
        .eq('user_id', session.sub)
        .maybeSingle()
      if (profile?.email?.toLowerCase() === 'owner@bixlay.com') {
        role = 'owner'
      }
    } catch {
      // keep role as admin
    }
  }
  return NextResponse.json({ role })
}
