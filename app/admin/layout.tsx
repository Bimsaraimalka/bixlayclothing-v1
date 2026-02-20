'use client'

import { AdminAuthProvider } from '@/components/admin/admin-auth-context'
import { AdminDataProvider } from '@/components/admin/admin-data-context'
import { AdminGuard } from '@/components/admin/admin-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <AdminGuard>
          {children}
        </AdminGuard>
      </AdminDataProvider>
    </AdminAuthProvider>
  )
}
