import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { validateAdminCredentials } from '@/lib/admin-auth'
import { signAdminSession } from '@/lib/admin-session-sign'

const ADMIN_SESSION_COOKIE = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      const fallback = validateAdminCredentials(email, password)
      if (fallback) {
        const secret = process.env.ADMIN_SESSION_SECRET
        if (secret) {
          const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE
          const cookieValue = signAdminSession(
            { sub: 'legacy', role: 'owner', exp },
            secret
          )
          const res = NextResponse.json({ ok: true })
          res.cookies.set(ADMIN_SESSION_COOKIE, cookieValue, {
            path: '/admin',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAX_AGE,
          })
          return res
        }
        return NextResponse.json({ ok: true })
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single()

    if (!profile?.role) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 401 })
    }

    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) {
      return NextResponse.json({ ok: true })
    }

    const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE
    const cookieValue = signAdminSession(
      { sub: authData.user.id, role: profile.role, exp },
      secret
    )
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_SESSION_COOKIE, cookieValue, {
      path: '/admin',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
