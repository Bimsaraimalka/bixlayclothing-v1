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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { userId } = await params
  const body = await request.json().catch(() => ({}))
  const role = body.role === 'owner' || body.role === 'admin' ? body.role : undefined
  if (!role) return NextResponse.json({ error: 'role required (owner or admin)' }, { status: 400 })
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('admin_profiles')
    .update({ role })
    .eq('user_id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession(request)
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { userId } = await params
  if (userId === session.sub) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
  }
  const supabase = createServiceRoleClient()
  const { error: deleteProfileError } = await supabase.from('admin_profiles').delete().eq('user_id', userId)
  if (deleteProfileError) return NextResponse.json({ error: deleteProfileError.message }, { status: 500 })
  await supabase.auth.admin.deleteUser(userId).catch(() => {})
  return NextResponse.json({ ok: true })
}
