'use server'

import { revalidatePath } from 'next/cache'
import { fetchStoreSettings, updateStoreSettingsSupabase } from '@/lib/supabase-data'
import type { StoreSettings } from '@/lib/admin-data'

/**
 * Single source of store settings from the database.
 * Used by: cart page, cart drawer, checkout form, checkout success, contact page.
 * All tax/shipping display and calculations read from this (store_settings table).
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  const settings = await fetchStoreSettings()
  if (settings) return settings
  return {
    default_shipping: 399,
    free_shipping_threshold: 5000,
    tax_enabled: true,
    tax_rate: 0.1,
    contact_phone: null,
    contact_phone_visible: false,
  }
}

/**
 * Persist store settings to the database and revalidate pages that use them.
 * Call this from admin Settings → General when saving. Cart, checkout, and contact
 * all use getStoreSettings() so they stay in sync with the DB.
 */
export async function saveStoreSettings(updates: Partial<StoreSettings>): Promise<void> {
  await updateStoreSettingsSupabase(updates)
  revalidatePath('/cart')
  revalidatePath('/checkout')
  revalidatePath('/checkout/success')
  revalidatePath('/contact')
}
