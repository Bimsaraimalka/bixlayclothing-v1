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

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('user_id, email, role, created_at')
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    (data ?? []).map((r: { user_id: string; email: string; role: string; created_at: string }) => ({
      user_id: r.user_id,
      email: r.email,
      role: r.role,
      created_at: r.created_at,
    }))
  )
}

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const role = body.role === 'owner' || body.role === 'admin' ? body.role : 'admin'
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Email and password (min 6 characters) required' }, { status: 400 })
  }
  const supabase = createServiceRoleClient()
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError) {
    return NextResponse.json(
      { error: authError.message.includes('already') ? 'Email already registered' : authError.message },
      { status: 400 }
    )
  }
  const { error: profileError } = await supabase.from('admin_profiles').insert({
    user_id: authData.user.id,
    email: authData.user.email ?? email,
    role,
  })
  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {})
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }
  return NextResponse.json({
    user_id: authData.user.id,
    email: authData.user.email ?? email,
    role,
  })
}
