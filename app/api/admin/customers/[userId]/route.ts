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

/** Get one customer by id. Must not be an admin. Owner only. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { userId } = await params
  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (profile) {
    return NextResponse.json({ error: 'User is an admin, not a customer' }, { status: 404 })
  }

  const { data: userData, error } = await supabase.auth.admin.getUserById(userId)
  if (error || !userData?.user) {
    return NextResponse.json({ error: error?.message ?? 'User not found' }, { status: 404 })
  }
  const u = userData.user
  return NextResponse.json({
    id: u.id,
    email: u.email ?? '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    email_confirmed_at: u.email_confirmed_at ?? null,
    banned_until: u.banned_until ?? null,
    user_metadata: u.user_metadata ?? {},
  })
}

/** Update customer (email, ban). Owner only. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { userId } = await params
  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (profile) {
    return NextResponse.json({ error: 'Cannot update an admin here. Use Team.' }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const updates: { email?: string; ban_duration?: string | number } = {}
  if (typeof body.email === 'string' && body.email.trim()) {
    updates.email = body.email.trim().toLowerCase()
  }
  if (body.banned === true) {
    updates.ban_duration = '876000h' // 100 years
  } else if (body.banned === false) {
    updates.ban_duration = 'none'
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates (email or banned)' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.admin.updateUserById(userId, updates)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const u = data.user
  return NextResponse.json({
    id: u?.id,
    email: u?.email ?? '',
    banned_until: u?.banned_until ?? null,
  })
}
