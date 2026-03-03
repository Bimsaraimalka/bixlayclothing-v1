import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session-verify'
import { createServiceRoleClient } from '@/lib/supabase'

const ADMIN_SESSION_COOKIE = 'admin_session'

async function getSession(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !cookie) return null
  return verifyAdminSession(cookie, secret)
}

/** List storefront customer accounts (Auth users not in admin_profiles). Owner only. */
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = Math.min(100, Math.max(10, parseInt(searchParams.get('per_page') ?? '50', 10)))

  const supabase = createServiceRoleClient()

  const [profilesRes, usersRes] = await Promise.all([
    supabase.from('admin_profiles').select('user_id'),
    supabase.auth.admin.listUsers({ page, perPage }),
  ])
  const adminUserIds = new Set((profilesRes.data ?? []).map((r: { user_id: string }) => r.user_id))
  const allUsers = usersRes.data?.users ?? []
  const error = usersRes.error
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const customers = allUsers
    .filter((u) => !adminUserIds.has(u.id))
    .map((u) => ({
      id: u.id,
      email: u.email ?? '',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
      banned_until: u.banned_until ?? null,
      user_metadata: u.user_metadata ?? {},
    }))

  return NextResponse.json({
    customers,
    page,
    per_page: perPage,
    has_more: allUsers.length >= perPage,
  })
}
