'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAdminData } from '@/components/admin/admin-data-context'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Pencil } from 'lucide-react'

export default function CategoriesSettingsPage() {
  const {
    productCategories,
    addProductCategory,
    updateProductCategory,
    removeProductCategory,
    loading,
    error,
  } = useAdminData()
  const [newName, setNewName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setSubmitting(true)
    try {
      await addProductCategory(name)
      setNewName('')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const saveEdit = async () => {
    if (editingId == null || !editName.trim()) return
    setSubmitting(true)
    try {
      await updateProductCategory(editingId, { name: editName.trim() })
      setEditingId(null)
      setEditName('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await removeProductCategory(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Product categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage categories used when adding products and in the storefront filter
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Add category */}
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Add category</h2>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. T-Shirts"
              className="min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation flex-1 min-w-[160px]"
            />
            <Button type="submit" disabled={submitting || !newName.trim()} className="min-h-[44px] px-5">
              <Plus size={18} className="mr-1.5" />
              Add
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-foreground p-4 sm:p-6 border-b border-border">
            Categories ({productCategories.length})
          </h2>
          {loading ? (
            <p className="p-4 sm:p-6 text-muted-foreground text-sm">Loading…</p>
          ) : productCategories.length === 0 ? (
            <p className="p-4 sm:p-6 text-muted-foreground text-sm">
              No categories yet. Add one above. Run the migration <code className="bg-muted px-1 rounded text-xs">supabase/migrations/add-product-categories.sql</code> if the table does not exist.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {productCategories.map((cat) => (
                <li key={cat.id} className="flex items-center gap-3 p-4 sm:p-6">
                  {editingId === cat.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit} disabled={submitting || !editName.trim()}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} disabled={submitting}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-medium text-foreground">{cat.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(cat.id, cat.name)}
                        className="shrink-0"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="shrink-0 text-destructive hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
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
