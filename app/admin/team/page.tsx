'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Users, Trash2, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type AdminProfile = { user_id: string; email: string; role: string; created_at: string }

export default function AdminTeamPage() {
  const router = useRouter()
  const { isOwner, role } = useAdminAuth()
  const [list, setList] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' as 'owner' | 'admin' })
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminProfile | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (role !== null && !isOwner) {
      router.replace('/admin')
      return
    }
    if (!isOwner) return
    setLoading(true)
    fetch('/api/admin/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isOwner, role, router])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password || form.password.length < 6) {
      setError('Email and password (min 6 characters) required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to add')
      setList((prev) => [...prev, { user_id: data.user_id, email: data.email, role: data.role, created_at: new Date().toISOString() }])
      setForm({ email: '', password: '', role: 'admin' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add admin')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'owner' | 'admin') => {
    try {
      const res = await fetch(`/api/admin/team/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setList((prev) => prev.map((p) => (p.user_id === userId ? { ...p, role: newRole } : p)))
    } catch {
      setError('Failed to update role')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/team/${deleteTarget.user_id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setList((prev) => prev.filter((p) => p.user_id !== deleteTarget.user_id))
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete admin')
    } finally {
      setDeleting(false)
    }
  }

  if (role === null && !isOwner) return null
  if (!isOwner) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Users size={24} />
            Team
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Add or remove admins and change roles. Only the owner can manage team.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6 max-w-md">
          <h2 className="text-base font-semibold text-foreground mb-4">Add admin</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                minLength={6}
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'owner' | 'admin' }))}
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <Button type="submit" disabled={submitting} className="min-h-[44px] px-5">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Add admin'}
            </Button>
          </form>
        </div>

        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-foreground p-4 border-b border-border">Admins</h2>
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : list.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No admins yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((p) => (
                <li key={p.user_id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-foreground">{p.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.user_id, e.target.value as 'owner' | 'admin')}
                      className="min-h-[40px] px-3 border border-border rounded-lg bg-background text-foreground text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(p)}
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove admin?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.email} will lose access to the admin dashboard. You cannot undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
