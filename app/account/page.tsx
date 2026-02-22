'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCustomerAuth } from '@/components/customer-auth-context'
import { LoadingScreen } from '@/components/loading-screen'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, signOut } = useCustomerAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/account/login?redirect=/account')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <LoadingScreen message="Loading your account…" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Account'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">My account</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your profile and view orders</p>

        <div className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Profile</h2>
            <p className="font-medium text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Orders</h2>
            <p className="text-sm text-muted-foreground mb-3">
              View your order history in the checkout success page or contact support with your order ID.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
          <div className="pt-4 border-t border-border">
            <Button variant="outline" onClick={() => signOut()} className="min-h-[44px] touch-manipulation">
              Sign out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
