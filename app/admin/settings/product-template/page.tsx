'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAdminData } from '@/components/admin/admin-data-context'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

export default function ProductTemplateSettingsPage() {
  const { productTemplates, productCategories, addProductTemplate, removeProductTemplate, loading, error } = useAdminData()
  const categoryNames = productCategories.length > 0 ? productCategories.map((c) => c.name) : ['T-Shirts', 'Crop Tops', 'Pants']
  const [form, setForm] = useState({
    name: '',
    category: 'T-Shirts',
    colors: '',
    sizes: '',
    unisex: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      await addProductTemplate({
        name: form.name.trim(),
        category: form.category,
        colors: form.colors.trim(),
        sizes: form.sizes.trim(),
        unisex: form.unisex,
      })
      setForm({ name: '', category: 'T-Shirts', colors: '', sizes: '', unisex: false })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await removeProductTemplate(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Product template</h1>
          <p className="text-sm text-muted-foreground mt-1">Create saved templates to quick-fill when adding products</p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Create template form */}
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Create template</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Template name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Summer Tee"
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
              >
                {categoryNames.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Colors</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
                  placeholder="Black, White, Navy"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Sizes</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                  placeholder="XS, S, M, L, XL"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 min-h-[44px]">
              <input
                type="checkbox"
                id="template-unisex"
                checked={form.unisex}
                onChange={(e) => setForm((f) => ({ ...f, unisex: e.target.checked }))}
                className="h-5 w-5 rounded border-border"
              />
              <label htmlFor="template-unisex" className="text-sm font-medium text-foreground cursor-pointer">
                Unisex
              </label>
            </div>
            <Button type="submit" disabled={submitting} className="min-h-[44px] px-5 rounded-lg font-medium touch-manipulation">
              <Plus size={18} className="mr-2 inline" />
              {submitting ? 'Saving…' : 'Save template'}
            </Button>
          </form>
        </div>

        {/* Saved templates list */}
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-foreground px-4 sm:px-6 py-3 border-b border-border">
            Saved templates ({productTemplates.length})
          </h2>
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading templates…</div>
          ) : productTemplates.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No saved templates yet. Create one above to use when adding products.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {productTemplates.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.category}
                      {t.colors ? ` · ${t.colors}` : ''}
                      {t.sizes ? ` · ${t.sizes}` : ''}
                      {t.unisex && ' · Unisex'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-destructive/50 hover:bg-destructive/10 text-destructive touch-manipulation disabled:opacity-50"
                    title="Delete template"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
