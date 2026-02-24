'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setStatus('error')
      setMessage('Please enter your email')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        setMessage('Thanks! You’re subscribed.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data?.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="w-full py-10 sm:py-14 lg:py-16 bg-secondary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-primary">
            Stay Updated
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-foreground/70">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="flex-1 min-h-[44px] px-4 py-3 rounded-lg bg-background border border-border text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation disabled:opacity-60"
              aria-invalid={status === 'error'}
              aria-describedby={status !== 'idle' && status !== 'loading' ? 'newsletter-message' : undefined}
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-[44px] px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium touch-manipulation disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </form>

          {message && (
            <p
              id="newsletter-message"
              className={`text-sm ${status === 'success' ? 'text-primary' : 'text-destructive'}`}
            >
              {message}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
