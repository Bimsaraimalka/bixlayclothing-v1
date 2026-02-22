'use server'

import { validatePromoCode as validatePromoCodeDb, type ValidatePromoResult } from '@/lib/supabase-data'

export async function validatePromoCode(code: string): Promise<ValidatePromoResult> {
  return validatePromoCodeDb(code.trim())
}
