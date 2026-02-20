'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import {
  fetchPromoCodes,
  addPromoCodeSupabase,
  updatePromoCodeSupabase,
  removePromoCodeSupabase,
} from '@/lib/supabase-data'
import type { PromoCode } from '@/lib/admin-data'
import { Trash2, Plus, Pencil } from 'lucide-react'

export default function PromoCodesPage() {
  const [list, setList] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '',
    valid_from: '',
    valid_until: '',
    max_uses: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '',
    valid_from: '',
    valid_until: '',
    max_uses: '',
  })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPromoCodes()
      setList(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load promo codes')
      setList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = form.code.trim().toUpperCase()
    const discountValue = form.discount_value.trim() ? parseFloat(form.discount_value) : NaN
    if (!code || (!Number.isFinite(discountValue) || discountValue <= 0)) return
    if (form.discount_type === 'percent' && discountValue > 100) return
    setSubmitting(true)
    setError(null)
    try {
      await addPromoCodeSupabase({
        code,
        discount_type: form.discount_type,
        discount_value: discountValue,
        valid_from: form.valid_from.trim() || null,
        valid_until: form.valid_until.trim() || null,
        max_uses: form.max_uses.trim() ? Math.max(0, parseInt(form.max_uses, 10) || 0) : null,
      })
      setForm({ code: '', discount_type: 'percent', discount_value: '', valid_from: '', valid_until: '', max_uses: '' })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add promo code')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (p: PromoCode) => {
    setEditingId(p.id)
    setEditForm({
      code: p.code,
      discount_type: p.discount_type,
      discount_value: String(p.discount_value),
      valid_from: p.valid_from ? p.valid_from.slice(0, 10) : '',
      valid_until: p.valid_until ? p.valid_until.slice(0, 10) : '',
      max_uses: p.max_uses != null ? String(p.max_uses) : '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async () => {
    if (editingId == null) return
    const discountValue = editForm.discount_value.trim() ? parseFloat(editForm.discount_value) : NaN
    if (!Number.isFinite(discountValue) || discountValue <= 0) return
    if (editForm.discount_type === 'percent' && discountValue > 100) return
    setSubmitting(true)
    setError(null)
    try {
      await updatePromoCodeSupabase(editingId, {
        code: editForm.code.trim().toUpperCase(),
        discount_type: editForm.discount_type,
        discount_value: discountValue,
        valid_from: editForm.valid_from.trim() || null,
        valid_until: editForm.valid_until.trim() || null,
        max_uses: editForm.max_uses.trim() ? Math.max(0, parseInt(editForm.max_uses, 10) || 0) : null,
      })
      setEditingId(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update promo code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await removePromoCodeSupabase(id)
      await load()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Promo codes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create codes that customers can enter at cart for a discount (percent or fixed amount)
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Add form */}
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Add promo code</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="min-w-[120px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE10"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base touch-manipulation"
                />
              </div>
              <div className="min-w-[100px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed (Rs.)</option>
                </select>
              </div>
              <div className="min-w-[100px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Value {form.discount_type === 'percent' ? '(%)' : '(Rs.)'}
                </label>
                <input
                  type="number"
                  min={form.discount_type === 'percent' ? 1 : 1}
                  max={form.discount_type === 'percent' ? 100 : undefined}
                  step={form.discount_type === 'percent' ? 1 : 100}
                  value={form.discount_value}
                  onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                  placeholder={form.discount_type === 'percent' ? '10' : '500'}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base touch-manipulation"
                />
              </div>
              <div className="min-w-[120px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Valid from (optional)</label>
                <input
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => setForm((f) => ({ ...f, valid_from: e.target.value }))}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                />
              </div>
              <div className="min-w-[120px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Valid until (optional)</label>
                <input
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                />
              </div>
              <div className="min-w-[80px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Max uses (optional)</label>
                <input
                  type="number"
                  min={0}
                  value={form.max_uses}
                  onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                  placeholder="∞"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base touch-manipulation"
                />
              </div>
              <Button type="submit" disabled={submitting || !form.code.trim() || !form.discount_value.trim()} className="min-h-[44px] px-5">
                <Plus size={18} className="mr-1.5" />
                Add
              </Button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-foreground p-4 sm:p-6 border-b border-border">
            Promo codes ({list.length})
          </h2>
          {loading ? (
            <p className="p-4 sm:p-6 text-muted-foreground text-sm">Loading…</p>
          ) : list.length === 0 ? (
            <p className="p-4 sm:p-6 text-muted-foreground text-sm">
              No promo codes yet. Add one above. Run the migration <code className="bg-muted px-1 rounded text-xs">supabase/migrations/add-promo-codes.sql</code> if the table does not exist.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((p) => (
                <li key={p.id} className="p-4 sm:p-6">
                  {editingId === p.id ? (
                    <div className="flex flex-wrap gap-3 items-end">
                      <input
                        type="text"
                        value={editForm.code}
                        onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                        className="min-h-[44px] px-3 border border-border rounded-lg w-28 font-mono"
                      />
                      <select
                        value={editForm.discount_type}
                        onChange={(e) => setEditForm((f) => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                        className="min-h-[44px] px-3 border border-border rounded-lg"
                      >
                        <option value="percent">%</option>
                        <option value="fixed">Rs.</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={editForm.discount_type === 'percent' ? 100 : undefined}
                        value={editForm.discount_value}
                        onChange={(e) => setEditForm((f) => ({ ...f, discount_value: e.target.value }))}
                        className="min-h-[44px] px-3 border border-border rounded-lg w-20"
                      />
                      <input
                        type="date"
                        value={editForm.valid_from}
                        onChange={(e) => setEditForm((f) => ({ ...f, valid_from: e.target.value }))}
                        className="min-h-[44px] px-3 border border-border rounded-lg"
                      />
                      <input
                        type="date"
                        value={editForm.valid_until}
                        onChange={(e) => setEditForm((f) => ({ ...f, valid_until: e.target.value }))}
                        className="min-h-[44px] px-3 border border-border rounded-lg"
                      />
                      <input
                        type="number"
                        min={0}
                        value={editForm.max_uses}
                        onChange={(e) => setEditForm((f) => ({ ...f, max_uses: e.target.value }))}
                        placeholder="Max uses"
                        className="min-h-[44px] px-3 border border-border rounded-lg w-24"
                      />
                      <Button type="button" size="sm" onClick={saveEdit} disabled={submitting}>Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-semibold text-foreground">{p.code}</span>
                        <span className="text-muted-foreground">
                          {p.discount_type === 'percent' ? `${p.discount_value}% off` : `Rs. ${p.discount_value} off`}
                        </span>
                        {(p.valid_from || p.valid_until) && (
                          <span className="text-xs text-muted-foreground">
                            {p.valid_from && `from ${p.valid_from.slice(0, 10)}`}
                            {p.valid_until && ` until ${p.valid_until.slice(0, 10)}`}
                          </span>
                        )}
                        {p.max_uses != null && (
                          <span className="text-xs text-muted-foreground">
                            Used {p.times_used} / {p.max_uses}
                          </span>
                        )}
                        {p.max_uses == null && p.times_used > 0 && (
                          <span className="text-xs text-muted-foreground">Used {p.times_used}×</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => startEdit(p)}>
                          <Pencil size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
