'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCustomerAuth } from '@/components/customer-auth-context'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/account'
  const { signIn, user } = useCustomerAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    router.replace(redirectTo)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setError(err)
      return
    }
    router.replace(redirectTo)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground text-center mb-2">
            Sign in
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Sign in to your Bixlay account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full min-h-[44px] touch-manipulation">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/account/signup" className="text-primary hover:underline font-medium">
              Create account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function AccountLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
