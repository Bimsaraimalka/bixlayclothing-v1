import { NextResponse } from 'next/server'
import { fetchStoreSettings } from '@/lib/supabase-data'

/**
 * Cron endpoint to keep Supabase free tier active (pings the project so it doesn't pause).
 * Secured by CRON_SECRET: Vercel adds it to all cron invocations in the Authorization header.
 */
export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await fetchStoreSettings()
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
