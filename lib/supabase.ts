import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  // Return existing instance if already created on the client side
  if (typeof window !== 'undefined' && supabaseClient) {
    return supabaseClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or Supabase anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)'
    )
  }

  const client = createSupabaseClient(url, anonKey)
  
  // Only cache on client side
  if (typeof window !== 'undefined') {
    supabaseClient = client
  }

  return client
}

export function isSupabaseConfigured(): boolean {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  return Boolean(typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && key)
}

/** Server-only: create Supabase client with service role (for admin APIs). */
export function createServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
