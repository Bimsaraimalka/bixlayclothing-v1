import { createClient } from '@/lib/supabase'

const BUCKET = 'library-images'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE_MB = 5

export type UploadResult = { url: string; path: string }

/** Upload an image file to the library bucket. Returns public URL and storage path.
 * Create bucket "library-images" in Supabase Dashboard (Storage) and set it to public with policies for anon upload/delete. */
export async function uploadLibraryImage(file: File, category: string): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error('Invalid file type. Use JPEG, PNG, GIF, or WebP.')
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    throw new Error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`)

  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, '_')
  const path = `${safeCategory}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    if (error.message?.toLowerCase().includes('bucket') && error.message?.toLowerCase().includes('not found')) {
      throw new Error(`Storage bucket "${BUCKET}" not found. Create it in Supabase: Storage → New bucket → name "${BUCKET}", set Public ON. See docs/ADMIN_SUPABASE_SETUP.md section 5b.`)
    }
    throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

/** Remove an image from storage by path. No-op if path is empty. */
export async function removeLibraryImageFromStorage(path: string | null): Promise<void> {
  if (!path?.trim()) return
  const supabase = createClient()
  await supabase.storage.from(BUCKET).remove([path])
}

/** Upload a product image (for Add/Edit product). Same bucket, path products/... */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error('Invalid file type. Use JPEG, PNG, GIF, or WebP.')
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    throw new Error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`)

  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    if (error.message?.toLowerCase().includes('bucket') && error.message?.toLowerCase().includes('not found')) {
      throw new Error(`Storage bucket "${BUCKET}" not found. Create it in Supabase: Storage → New bucket → name "${BUCKET}", set Public ON. See docs/ADMIN_SUPABASE_SETUP.md section 5b.`)
    }
    throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}
