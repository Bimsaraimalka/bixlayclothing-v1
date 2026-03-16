'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserCircle, Loader2, Eye, Ban, ShieldOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type Customer = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  banned_until: string | null
  user_metadata: Record<string, unknown>
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const { isOwner, role } = useAdminAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detail, setDetail] = useState<Customer | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    if (role !== null && !isOwner) {
      router.replace('/admin')
      return
    }
    if (!isOwner) return
    setLoading(true)
    setError(null)
    fetch(`/api/admin/customers?page=${page}&per_page=50`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => {
        setCustomers(data.customers ?? [])
        setHasMore(data.has_more === true)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isOwner, role, router, page])

  useEffect(() => {
    if (!detailId) {
      setDetail(null)
      return
    }
    setDetailLoading(true)
    setEditError(null)
    fetch(`/api/admin/customers/${detailId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load customer')
        return res.json()
      })
      .then((data) => {
        setDetail(data)
        setEditEmail(data.email ?? '')
      })
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false))
  }, [detailId])

  const handleSave = async () => {
    if (!detailId || !detail) return
    const trimmed = editEmail.trim()
    const banned = !!detail.banned_until
    setSaving(true)
    setEditError(null)
    try {
      const body: { email?: string; banned?: boolean } = {}
      if (trimmed !== detail.email) body.email = trimmed
      const res = await fetch(`/api/admin/customers/${detailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      setDetail((d) => (d ? { ...d, email: trimmed } : d))
      setCustomers((prev) => prev.map((c) => (c.id === detailId ? { ...c, email: trimmed } : c)))
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleBan = async (ban: boolean) => {
    if (!detailId) return
    setSaving(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/admin/customers/${detailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: ban }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      const updated = { ...data }
      setDetail((d) => (d ? { ...d, banned_until: updated.banned_until ?? null } : d))
      setCustomers((prev) =>
        prev.map((c) => (c.id === detailId ? { ...c, banned_until: updated.banned_until ?? null } : c))
      )
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (s: string | null) => (s ? new Date(s).toLocaleString() : '—')

  if (role === null && !isOwner) return null
  if (!isOwner) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <UserCircle size={24} />
            Customer accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Storefront users who signed up for an account. View details and edit or ban.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading…
            </p>
          ) : customers.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No customer accounts yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Signed up</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Last sign in</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium text-foreground">{c.email || '—'}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{formatDate(c.created_at)}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{formatDate(c.last_sign_in_at)}</td>
                        <td className="py-3 px-4">
                          {c.banned_until ? (
                            <span className="inline-flex items-center gap-1 text-destructive font-medium">
                              <Ban size={14} /> Banned
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Active</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setDetailId(c.id)}
                          >
                            <Eye size={16} /> View / Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="p-4 border-t border-border flex justify-center">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer details</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <p className="py-6 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading…
            </p>
          ) : detail ? (
            <div className="space-y-4">
              {editError && (
                <p className="text-sm text-destructive">{editError}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="font-mono text-xs break-all">{detail.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Signed up</dt>
                  <dd>{formatDate(detail.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last sign in</dt>
                  <dd>{formatDate(detail.last_sign_in_at)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>{detail.banned_until ? 'Banned' : 'Active'}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || editEmail.trim() === detail.email}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save email'}
                </Button>
                {detail.banned_until ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleBan(false)}
                    disabled={saving}
                    className="gap-1.5"
                  >
                    <ShieldOff size={16} /> Unban
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleBan(true)}
                    disabled={saving}
                    className="gap-1.5 text-destructive hover:text-destructive"
                  >
                    <Ban size={16} /> Ban user
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
