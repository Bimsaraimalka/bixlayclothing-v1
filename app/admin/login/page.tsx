'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    router.replace('/admin')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    const ok = login(trimmedEmail, password)
    if (ok) {
      // Full page navigation so auth state is read from storage on load
      window.location.href = '/admin'
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground text-center mb-2">
          Bixlay Admin
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-6">
          Sign in to manage products and view sales
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bixlay.com"
              className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full min-h-[44px] rounded-lg font-medium touch-manipulation">
            Sign in
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo: admin@bixlay.com / admin123
        </p>
      </div>
    </div>
  )
}
