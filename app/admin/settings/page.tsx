'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { fetchStoreSettings, updateStoreSettingsSupabase } from '@/lib/supabase-data'
import type { StoreSettings } from '@/lib/admin-data'

export default function AdminSettingsPage() {
  const { isOwner } = useAdminAuth()
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    default_shipping: '399',
    free_shipping_threshold: '5000',
    tax_enabled: true,
    tax_rate: '0.1',
    contact_phone: '',
    contact_phone_visible: false,
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchStoreSettings()
      .then((data) => {
        if (cancelled) return
        if (data) {
          setSettings(data)
          setForm({
            default_shipping: String(data.default_shipping),
            free_shipping_threshold: String(data.free_shipping_threshold),
            tax_enabled: data.tax_enabled,
            tax_rate: String(data.tax_rate),
            contact_phone: data.contact_phone ?? '',
            contact_phone_visible: data.contact_phone_visible === true,
          })
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load settings')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const defaultShipping = Math.max(0, parseFloat(form.default_shipping) || 0)
      const freeThreshold = Math.max(0, parseFloat(form.free_shipping_threshold) || 0)
      const taxRate = Math.max(0, Math.min(1, parseFloat(form.tax_rate) || 0))
      await updateStoreSettingsSupabase({
        default_shipping: defaultShipping,
        free_shipping_threshold: freeThreshold,
        tax_enabled: form.tax_enabled,
        tax_rate: taxRate,
        contact_phone: form.contact_phone.trim() || null,
        contact_phone_visible: form.contact_phone_visible,
      })
      setSettings({
        default_shipping: defaultShipping,
        free_shipping_threshold: freeThreshold,
        tax_enabled: form.tax_enabled,
        tax_rate: taxRate,
        contact_phone: form.contact_phone.trim() || null,
        contact_phone_visible: form.contact_phone_visible,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Store-wide shipping and tax</p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Shipping & Tax */}
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Shipping &amp; Tax</h2>
          {!isOwner && (
            <p className="text-sm text-muted-foreground mb-4">Only the owner can edit these settings.</p>
          )}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Default shipping cost (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.default_shipping}
                  onChange={(e) => setForm((f) => ({ ...f, default_shipping: e.target.value }))}
                  disabled={!isOwner}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Used when a product has no custom shipping cost</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Free shipping threshold (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.free_shipping_threshold}
                  onChange={(e) => setForm((f) => ({ ...f, free_shipping_threshold: e.target.value }))}
                  disabled={!isOwner}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Order subtotal at or above this gets free shipping</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tax_enabled"
                  checked={form.tax_enabled}
                  onChange={(e) => setForm((f) => ({ ...f, tax_enabled: e.target.checked }))}
                  disabled={!isOwner}
                  className="h-5 w-5 rounded border-border disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <label htmlFor="tax_enabled" className="text-sm font-medium text-foreground cursor-pointer">
                  Enable tax
                </label>
                {!isOwner && (
                  <span className="text-xs text-muted-foreground" title="Only the owner can edit these settings">
                    (Only the owner can change this)
                  </span>
                )}
              </div>
              {form.tax_enabled && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Tax rate (0–1)</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={form.tax_rate}
                    onChange={(e) => setForm((f) => ({ ...f, tax_rate: e.target.value }))}
                    disabled={!isOwner}
                    className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">e.g. 0.1 = 10%</p>
                </div>
              )}
              {isOwner && (
                <Button type="submit" disabled={saving} className="min-h-[44px] px-5">
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              )}
            </form>
          )}
        </div>

        {/* Contact / Site phone (owner only) */}
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Contact / Site</h2>
          {!isOwner && (
            <p className="text-sm text-muted-foreground mb-4">Only the owner can edit these settings.</p>
          )}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Site phone number</label>
                <input
                  type="text"
                  inputMode="tel"
                  placeholder="e.g. +94760272240"
                  value={form.contact_phone}
                  onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
                  disabled={!isOwner}
                  className="w-full min-h-[44px] px-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Shown on Contact page and checkout success when visibility is on</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="contact_phone_visible"
                  checked={form.contact_phone_visible}
                  onChange={(e) => setForm((f) => ({ ...f, contact_phone_visible: e.target.checked }))}
                  disabled={!isOwner}
                  className="h-5 w-5 rounded border-border disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <label htmlFor="contact_phone_visible" className="text-sm font-medium text-foreground cursor-pointer">
                  Show phone on site (Contact page &amp; payment completed)
                </label>
                {!isOwner && (
                  <span className="text-xs text-muted-foreground" title="Only the owner can edit these settings">
                    (Only the owner can change this)
                  </span>
                )}
              </div>
              {isOwner && (
                <Button type="submit" disabled={saving} className="min-h-[44px] px-5">
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
