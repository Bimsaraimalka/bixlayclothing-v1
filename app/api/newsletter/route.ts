import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const raw = typeof body?.email === 'string' ? body.email.trim() : ''
    const email = raw.toLowerCase()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Subscription failed. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscribed: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
