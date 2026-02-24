'use server'

import { fetchStoreSettings } from '@/lib/supabase-data'
import type { StoreSettings } from '@/lib/admin-data'

/** Returns store settings (shipping, tax, contact). Returns defaults if table missing or error. */
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
