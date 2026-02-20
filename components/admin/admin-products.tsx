'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Plus, Upload, X, GripVertical, ExternalLink } from 'lucide-react'
import { uploadProductImage } from '@/lib/supabase-storage'
import type { AdminProduct } from '@/lib/admin-data'
import { PRODUCT_SEGMENTS, DEFAULT_CATEGORY_NAMES } from '@/lib/admin-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { formatPrice } from '@/lib/utils'
import { useAdminData } from '@/components/admin/admin-data-context'

const COLOR_PRESETS = [
  { label: 'Black & White', value: 'Black, White' },
  { label: 'Basics', value: 'Black, White, Navy, Gray' },
  { label: 'Pastels', value: 'Pink, Lavender, Mint, Cream' },
  { label: 'Neutrals', value: 'Black, White, Gray, Beige' },
]
const SIZE_PRESETS = [
  { label: 'XS–XL', value: 'XS, S, M, L, XL' },
  { label: 'S–XL', value: 'S, M, L, XL' },
  { label: 'Waist', value: '28, 30, 32, 34, 36' },
]
const QUICK_TEMPLATES: { name: string; category: string; colors: string; sizes: string; unisex?: boolean }[] = [
  { name: 'T-Shirt', category: 'T-Shirts', colors: 'Black, White, Navy', sizes: 'XS, S, M, L, XL' },
  { name: 'Crop Top', category: 'Crop Tops', colors: 'Black, White, Pink', sizes: 'XS, S, M, L' },
  { name: 'Pants', category: 'Pants', colors: 'Black, Navy, Beige', sizes: 'XS, S, M, L, XL' },
  { name: 'Unisex Tee', category: 'T-Shirts', colors: 'Black, White, Gray', sizes: 'XS, S, M, L, XL', unisex: true },
]

function reorderImages(urls: string[], fromIndex: number, toIndex: number): string[] {
  if (fromIndex === toIndex) return urls
  const copy = [...urls]
  const [removed] = copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, removed)
  return copy
}

const emptyForm = () => ({
  name: '',
  category: 'T-Shirts',
  price: '',
  stock: '10',
  colors: '',
  sizes: '',
  unisex: false,
  segment: 'Unisex' as const,
  new_arrival: false,
  discount_percent: '',
  promo_code: '',
  image_urls: [] as string[],
  details: '',
})

export function AdminProducts() {
  const { products, productTemplates, productCategories, addProduct, updateProduct, removeProduct, loading, error } = useAdminData()
  const categoryNames = productCategories.length > 0 ? productCategories.map((c) => c.name) : [...DEFAULT_CATEGORY_NAMES]
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [editForm, setEditForm] = useState(emptyForm())
  const [dragAddImageIndex, setDragAddImageIndex] = useState<number | null>(null)
  const [dragEditImageIndex, setDragEditImageIndex] = useState<number | null>(null)

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    let matchCat = true
    if (categoryFilter === 'All') matchCat = true
    else if (categoryFilter === 'Men' || categoryFilter === 'Women') matchCat = p.segment === categoryFilter || p.segment === 'Unisex'
    else if (categoryFilter === 'Unisex') matchCat = p.segment === 'Unisex'
    else if (categoryFilter === 'New Arrivals') matchCat = p.new_arrival === true
    else matchCat = p.category === categoryFilter
    return matchSearch && matchCat
  })

  const [addSubmitting, setAddSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)

  const openEdit = (product: AdminProduct) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      colors: (product.colors ?? []).join(', '),
      sizes: (product.sizes ?? []).join(', '),
      unisex: product.unisex === true,
      segment: product.segment === 'Men' || product.segment === 'Women' ? product.segment : 'Unisex',
      new_arrival: product.new_arrival === true,
      discount_percent: product.discount_percent != null ? String(product.discount_percent) : '',
      promo_code: product.promo_code ?? '',
      image_urls: product.image_urls ?? [],
      details: (product.details ?? []).join('\n'),
    })
  }

  const templatesToShow = productTemplates.length > 0
    ? productTemplates.map((t) => ({ id: t.id, name: t.name, category: t.category, colors: t.colors, sizes: t.sizes, unisex: t.unisex }))
    : QUICK_TEMPLATES.map((t) => ({ id: undefined, ...t }))

  const applyTemplate = (t: { name: string; category: string; colors: string; sizes: string; unisex?: boolean }) => {
    setForm((f) => ({
      ...f,
      name: f.name.trim() ? f.name : t.name,
      category: t.category,
      colors: t.colors,
      sizes: t.sizes,
      unisex: t.unisex ?? f.unisex,
    }))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)
    if (!form.name.trim() || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) return
    const colors = form.colors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const sizes = form.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const discountPercent = form.discount_percent.trim() ? Math.min(100, Math.max(0, parseFloat(form.discount_percent) || 0)) : null
    const promoCode = form.promo_code.trim() || null
    const details = form.details
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    setAddSubmitting(true)
    try {
      await addProduct({
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
        colors,
        sizes,
        unisex: form.unisex,
        segment: form.segment,
        new_arrival: form.new_arrival,
        discount_percent: discountPercent,
        promo_code: promoCode,
        image_urls: form.image_urls,
        details,
      })
      setForm(emptyForm())
      setAddOpen(false)
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    const price = parseFloat(editForm.price)
    const stock = parseInt(editForm.stock, 10)
    if (!editForm.name.trim() || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) return
    const colors = editForm.colors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const sizes = editForm.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const discountPercent = editForm.discount_percent.trim() ? Math.min(100, Math.max(0, parseFloat(editForm.discount_percent) || 0)) : null
    const promoCode = editForm.promo_code.trim() || null
    setEditSubmitting(true)
    try {
      await updateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        category: editForm.category,
        price,
        stock,
        colors,
        sizes,
        unisex: editForm.unisex,
        segment: editForm.segment,
        new_arrival: editForm.new_arrival,
        discount_percent: discountPercent,
        promo_code: promoCode,
        image_urls: editForm.image_urls,
        details: editForm.details
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setEditingProduct(null)
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDeleteClick = (id: string) => setProductToDelete(id)

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    setDeleteId(productToDelete)
    try {
      await removeProduct(productToDelete)
      setProductToDelete(null)
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading products…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product inventory and details</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium touch-manipulation">
              <Plus size={20} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col p-0 gap-0 w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] sm:max-h-[85vh] overflow-hidden rounded-xl">
            <DialogHeader className="shrink-0 border-b border-border bg-background px-4 sm:px-6 pt-4 pb-3 pr-16 sm:pr-16">
              <DialogTitle className="text-lg sm:text-xl">Add new product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Quick template (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {templatesToShow.map((t) => (
                    <button
                      key={t.id ?? t.name}
                      type="button"
                      onClick={() => applyTemplate(t)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors touch-manipulation"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Fills category, colors & sizes; add your name & price</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Product name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Classic T-Shirt"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Audience (Men / Women / Unisex)</label>
                <p className="text-xs text-muted-foreground mb-1">Where this product appears: Men page, Women page, or both (Unisex).</p>
                <select
                  value={form.segment}
                  onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value as 'Men' | 'Women' | 'Unisex' }))}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                >
                  {PRODUCT_SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <input
                  type="checkbox"
                  id="add-new-arrival"
                  checked={form.new_arrival}
                  onChange={(e) => setForm((f) => ({ ...f, new_arrival: e.target.checked }))}
                  className="h-5 w-5 rounded border-border touch-manipulation"
                />
                <label htmlFor="add-new-arrival" className="text-sm font-medium text-foreground cursor-pointer touch-manipulation">
                  Show in New Arrivals (home & New Arrivals page)
                </label>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">Images (optional)</label>
                <p className="text-xs text-muted-foreground mb-2">Upload product images. JPEG, PNG, GIF or WebP, max 5MB each.</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  className="w-full min-h-[44px] px-4 py-2 border border-border rounded-lg bg-background text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  onChange={async (e) => {
                    const files = e.target.files ? Array.from(e.target.files) : []
                    for (const file of files) {
                      try {
                        const { url } = await uploadProductImage(file)
                        setForm((f) => ({ ...f, image_urls: [...f.image_urls, url] }))
                      } catch (err) {
                        console.error(err)
                      }
                    }
                    e.target.value = ''
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-3 min-h-[84px]">
                  {form.image_urls.map((url, i) => (
                    <div
                      key={`add-${i}-${url.slice(-12)}`}
                      draggable
                      onDragStart={(e) => {
                        setDragAddImageIndex(i)
                        e.dataTransfer.setData('text/plain', String(i))
                        e.dataTransfer.effectAllowed = 'move'
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const from = dragAddImageIndex
                        if (from == null) return
                        setForm((f) => ({ ...f, image_urls: reorderImages(f.image_urls, from, i) }))
                        setDragAddImageIndex(null)
                      }}
                      onDragEnd={() => setDragAddImageIndex(null)}
                      className={`relative w-20 h-20 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-muted cursor-grab active:cursor-grabbing ${dragAddImageIndex === i ? 'opacity-50 ring-2 ring-primary' : ''}`}
                    >
                      <span className="absolute top-0.5 left-0.5 z-10 w-5 h-5 flex items-center justify-center rounded bg-background/80 text-muted-foreground pointer-events-none">
                        <GripVertical size={12} />
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover pointer-events-none"
                        width={80}
                        height={80}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.classList.remove('hidden')
                        }}
                      />
                      <span className="hidden absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-1 text-center">Image</span>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image_urls: f.image_urls.filter((_, j) => j !== i) }))}
                        className="absolute top-0.5 right-0.5 w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive z-10"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {form.image_urls.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{form.image_urls.length} image{form.image_urls.length !== 1 ? 's' : ''} added — drag to reorder</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Product details (optional)</label>
                <p className="text-xs text-muted-foreground mb-1">One line per bullet, shown on the product page.</p>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                  placeholder="Premium materials&#10;Comfortable fit&#10;Quality craftsmanship"
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation resize-y"
                />
              </div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <input
                  type="checkbox"
                  id="add-unisex"
                  checked={form.unisex}
                  onChange={(e) => setForm((f) => ({ ...f, unisex: e.target.checked }))}
                  className="h-5 w-5 rounded border-border touch-manipulation"
                />
                <label htmlFor="add-unisex" className="text-sm font-medium text-foreground cursor-pointer touch-manipulation">
                  Unisex (for all genders)
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="10"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, colors: p.value }))}
                      className="px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-xs text-foreground hover:bg-muted transition-colors touch-manipulation"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
                  placeholder="Or type: Black, White, Navy"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Sizes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SIZE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, sizes: p.value }))}
                      className="px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-xs text-foreground hover:bg-muted transition-colors touch-manipulation"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                  placeholder="Or type: XS, S, M, L, XL"
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Discount % (optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={form.discount_percent}
                    onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value }))}
                    placeholder="e.g. 10"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Promo code (optional)</label>
                  <input
                    type="text"
                    value={form.promo_code}
                    onChange={(e) => setForm((f) => ({ ...f, promo_code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SAVE10"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  />
                </div>
              </div>
              </div>
              <div className="shrink-0 border-t border-border bg-background px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2">
                <Button type="submit" disabled={addSubmitting} className="min-h-[44px] px-5 rounded-lg font-medium touch-manipulation w-full sm:w-auto order-2 sm:order-1">
                  {addSubmitting ? 'Adding…' : 'Add product'}
                </Button>
                <Button type="button" variant="outline" className="min-h-[44px] px-5 rounded-lg touch-manipulation w-full sm:w-auto order-1 sm:order-2" onClick={() => setAddOpen(false)} disabled={addSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
          <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-sm rounded-xl p-4 sm:p-6 gap-4 sm:gap-6">
            <AlertDialogHeader className="text-left gap-2">
              <AlertDialogTitle className="text-lg sm:text-xl">Remove product?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This will permanently remove this product. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialogCancel className="min-h-[44px] w-full sm:w-auto rounded-lg touch-manipulation m-0">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleDeleteConfirm()
                }}
                disabled={deleteId !== null}
                className="min-h-[44px] w-full sm:w-auto rounded-lg touch-manipulation m-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteId ? 'Removing…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="flex flex-col p-0 gap-0 w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] sm:max-h-[85vh] overflow-hidden rounded-xl">
            <DialogHeader className="shrink-0 border-b border-border bg-background px-4 sm:px-6 pt-4 pb-3 pr-16 sm:pr-16">
              <DialogTitle className="text-lg sm:text-xl">Edit product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Product name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  >
                    {!categoryNames.includes(editForm.category) && (
                      <option value={editForm.category}>{editForm.category}</option>
                    )}
                    {categoryNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Audience (Men / Women / Unisex)</label>
                  <select
                    value={editForm.segment}
                    onChange={(e) => setEditForm((f) => ({ ...f, segment: e.target.value as 'Men' | 'Women' | 'Unisex' }))}
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  >
                    {PRODUCT_SEGMENTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="checkbox"
                    id="edit-new-arrival"
                    checked={editForm.new_arrival}
                    onChange={(e) => setEditForm((f) => ({ ...f, new_arrival: e.target.checked }))}
                    className="h-5 w-5 rounded border-border touch-manipulation"
                  />
                  <label htmlFor="edit-new-arrival" className="text-sm font-medium text-foreground cursor-pointer touch-manipulation">
                    Show in New Arrivals
                  </label>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Images (optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="w-full min-h-[44px] px-4 py-2 border border-border rounded-lg bg-background text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    onChange={async (e) => {
                      const files = e.target.files ? Array.from(e.target.files) : []
                      for (const file of files) {
                        try {
                          const { url } = await uploadProductImage(file)
                          setEditForm((f) => ({ ...f, image_urls: [...f.image_urls, url] }))
                        } catch (err) {
                          console.error(err)
                        }
                      }
                      e.target.value = ''
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-3 min-h-[84px]">
                    {editForm.image_urls.map((url, i) => (
                      <div
                        key={`edit-${i}-${url.slice(-12)}`}
                        draggable
                        onDragStart={(e) => {
                          setDragEditImageIndex(i)
                          e.dataTransfer.setData('text/plain', String(i))
                          e.dataTransfer.effectAllowed = 'move'
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = 'move'
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const from = dragEditImageIndex
                          if (from == null) return
                          setEditForm((f) => ({ ...f, image_urls: reorderImages(f.image_urls, from, i) }))
                          setDragEditImageIndex(null)
                        }}
                        onDragEnd={() => setDragEditImageIndex(null)}
                        className={`relative w-20 h-20 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-muted cursor-grab active:cursor-grabbing ${dragEditImageIndex === i ? 'opacity-50 ring-2 ring-primary' : ''}`}
                      >
                        <span className="absolute top-0.5 left-0.5 z-10 w-5 h-5 flex items-center justify-center rounded bg-background/80 text-muted-foreground pointer-events-none">
                          <GripVertical size={12} />
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover pointer-events-none"
                          width={80}
                          height={80}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.classList.remove('hidden')
                          }}
                        />
                        <span className="hidden absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-1 text-center">Image</span>
                        <button
                          type="button"
                          onClick={() => setEditForm((f) => ({ ...f, image_urls: f.image_urls.filter((_, j) => j !== i) }))}
                          className="absolute top-0.5 right-0.5 w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive z-10"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {editForm.image_urls.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">{editForm.image_urls.length} image{editForm.image_urls.length !== 1 ? 's' : ''} — drag to reorder</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Product details (optional)</label>
                  <textarea
                    value={editForm.details}
                    onChange={(e) => setEditForm((f) => ({ ...f, details: e.target.value }))}
                    placeholder="One line per bullet"
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation resize-y"
                  />
                </div>
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="checkbox"
                    id="edit-unisex"
                    checked={editForm.unisex}
                    onChange={(e) => setEditForm((f) => ({ ...f, unisex: e.target.checked }))}
                    className="h-5 w-5 rounded border-border touch-manipulation"
                  />
                  <label htmlFor="edit-unisex" className="text-sm font-medium text-foreground cursor-pointer touch-manipulation">
                    Unisex (for all genders)
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editForm.price}
                      onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.stock}
                      onChange={(e) => setEditForm((f) => ({ ...f, stock: e.target.value }))}
                      className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Colors</label>
                  <input
                    type="text"
                    value={editForm.colors}
                    onChange={(e) => setEditForm((f) => ({ ...f, colors: e.target.value }))}
                    placeholder="Black, White, Navy"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Sizes</label>
                  <input
                    type="text"
                    value={editForm.sizes}
                    onChange={(e) => setEditForm((f) => ({ ...f, sizes: e.target.value }))}
                    placeholder="XS, S, M, L, XL"
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Discount % (optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={editForm.discount_percent}
                      onChange={(e) => setEditForm((f) => ({ ...f, discount_percent: e.target.value }))}
                      placeholder="e.g. 10"
                      className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Promo code (optional)</label>
                    <input
                      type="text"
                      value={editForm.promo_code}
                      onChange={(e) => setEditForm((f) => ({ ...f, promo_code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SAVE10"
                      className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                    />
                  </div>
                </div>
              </div>
              <div className="shrink-0 border-t border-border bg-background px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2">
                <Button type="submit" disabled={editSubmitting} className="min-h-[44px] px-5 rounded-lg font-medium touch-manipulation w-full sm:w-auto order-2 sm:order-1">
                  {editSubmitting ? 'Saving…' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" className="min-h-[44px] px-5 rounded-lg touch-manipulation w-full sm:w-auto order-1 sm:order-2" onClick={() => setEditingProduct(null)} disabled={editSubmitting}>
                  Cancel
                </Button>
              </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="min-h-[44px] px-4 rounded-lg border border-border bg-background text-foreground text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-0 sm:min-w-[160px] touch-manipulation"
        >
          <option value="All">All</option>
          <option value="New Arrivals">New Arrivals</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
          {categoryNames.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Narrow / small screens: card layout (default up to lg) */}
      <div className="lg:hidden space-y-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-background border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground break-words">{product.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.category}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  {product.unisex && (
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      Unisex
                    </span>
                  )}
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                      product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Price</dt>
                  <dd className="font-medium text-foreground">{formatPrice(product.price)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-medium text-foreground">{product.stock} units</dd>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <dt className="text-muted-foreground">Colors</dt>
                  <dd className="text-foreground truncate" title={(product.colors ?? []).join(', ')}>
                    {(product.colors ?? []).length ? (product.colors ?? []).join(', ') : '—'}
                  </dd>
                </div>
              </dl>
              {(product.sizes ?? []).length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Sizes: {(product.sizes ?? []).join(', ')}
                </p>
              )}
              {(product.discount_percent != null || (product.promo_code ?? '').trim()) && (
                <p className="text-xs text-muted-foreground mt-2">
                  {product.discount_percent != null && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">{product.discount_percent}% off</span>
                  )}
                  {product.discount_percent != null && (product.promo_code ?? '').trim() && ' · '}
                  {(product.promo_code ?? '').trim() && (
                    <span className="font-mono">{(product.promo_code ?? '').trim()}</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex border-t border-border bg-muted/30 px-4 py-2 gap-2 flex-wrap">
              <Link
                href={`/products/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-sm font-medium touch-manipulation px-4"
                title="View on store"
              >
                <ExternalLink size={18} />
                View
              </Link>
              <button
                type="button"
                onClick={() => openEdit(product)}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-sm font-medium touch-manipulation min-w-0"
                title="Edit"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(product.id)}
                disabled={deleteId === product.id}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-background hover:bg-destructive/10 text-destructive text-sm font-medium touch-manipulation disabled:opacity-50 min-w-0"
                title="Remove"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
        <p className="text-sm text-muted-foreground py-2">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      {/* Wide screens: table with horizontal scroll on smaller desktop */}
      <div className="hidden lg:block bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">ID</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Product</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Category</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Price</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Stock</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Colors</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Sizes</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Status</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Unisex</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Discount</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Promo</th>
                <th className="text-left py-3 px-4 xl:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 xl:px-6 font-mono text-sm text-muted-foreground whitespace-nowrap">{product.id}</td>
                  <td className="py-3 px-4 xl:px-6 font-medium text-foreground max-w-[180px] truncate" title={product.name}>{product.name}</td>
                  <td className="py-3 px-4 xl:px-6 text-foreground text-sm whitespace-nowrap">{product.category}</td>
                  <td className="py-3 px-4 xl:px-6 font-medium text-foreground whitespace-nowrap">{formatPrice(product.price)}</td>
                  <td className="py-3 px-4 xl:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                        product.stock > 50 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : product.stock > 0 ? 'bg-muted text-foreground' : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 xl:px-6 text-muted-foreground text-sm max-w-[120px] truncate" title={(product.colors ?? []).join(', ')}>
                    {(product.colors ?? []).length ? (product.colors ?? []).join(', ') : '—'}
                  </td>
                  <td className="py-3 px-4 xl:px-6 text-muted-foreground text-sm max-w-[100px] truncate" title={(product.sizes ?? []).join(', ')}>
                    {(product.sizes ?? []).length ? (product.sizes ?? []).join(', ') : '—'}
                  </td>
                  <td className="py-3 px-4 xl:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                        product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 xl:px-6 text-muted-foreground text-sm whitespace-nowrap">
                    {product.unisex ? 'Yes' : '—'}
                  </td>
                  <td className="py-3 px-4 xl:px-6 text-sm whitespace-nowrap">
                    {product.discount_percent != null ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{product.discount_percent}%</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 xl:px-6 text-muted-foreground text-sm font-mono whitespace-nowrap">
                    {(product.promo_code ?? '').trim() || '—'}
                  </td>
                  <td className="py-3 px-4 xl:px-6 whitespace-nowrap">
                    <div className="flex gap-1">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View on store"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button type="button" onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={deleteId === product.id}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 xl:px-6 py-3 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {products.length} products
          </p>
        </div>
      </div>
    </div>
  )
}
