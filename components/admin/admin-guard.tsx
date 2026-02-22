'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { getStoredAuth } from '@/lib/admin-auth'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    if (!isAuthenticated && !getStoredAuth()) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/30 p-4">
        <p className="text-muted-foreground text-center">Not authenticated.</p>
        <p className="text-sm text-muted-foreground text-center">Redirecting to login…</p>
        <Link
          href="/admin/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Go to login
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
