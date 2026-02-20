import { createClient } from '@/lib/supabase'
import type { AdminProduct, AdminOrder, ProductTemplate, ProductCategory, PromoCode } from '@/lib/admin-data'

type ProductRow = {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
  colors: string[] | unknown
  sizes: string[] | unknown
  unisex?: boolean
  segment?: string | null
  new_arrival?: boolean
  discount_percent?: number | null
  promo_code?: string | null
  image_urls?: string[] | unknown
  details?: string[] | unknown
  created_at?: string
}

type OrderRow = {
  id: number
  customer: string
  email: string
  amount: string
  status: string
  date: string
  promo_code?: string | null
  created_at?: string
}

type PromoCodeRow = {
  id: number
  code: string
  discount_type: string
  discount_value: number
  valid_from: string | null
  valid_until: string | null
  max_uses: number | null
  times_used: number
  created_at?: string
}

type ProductTemplateRow = {
  id: number
  name: string
  category: string
  colors: string
  sizes: string
  unisex: boolean
  created_at?: string
}

type ProductCategoryRow = {
  id: number
  name: string
  sort_order: number
  created_at?: string
}

function parseJsonStringArray(v: string[] | unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string') try { return JSON.parse(v || '[]') } catch { return [] }
  return []
}

function toAdminProduct(r: ProductRow): AdminProduct {
  const discount = r.discount_percent != null ? Number(r.discount_percent) : null
  const seg = r.segment === 'Men' || r.segment === 'Women' || r.segment === 'Unisex' ? r.segment : 'Unisex'
  return {
    id: String(r.id),
    name: r.name,
    category: r.category,
    price: Number(r.price),
    stock: r.stock,
    status: r.status,
    colors: Array.isArray(r.colors) ? r.colors : (typeof r.colors === 'string' ? JSON.parse(r.colors || '[]') : []) as string[],
    sizes: Array.isArray(r.sizes) ? r.sizes : (typeof r.sizes === 'string' ? JSON.parse(r.sizes || '[]') : []) as string[],
    unisex: r.unisex === true,
    segment: seg,
    new_arrival: r.new_arrival === true,
    discount_percent: discount != null && !Number.isNaN(discount) && discount >= 0 && discount <= 100 ? discount : null,
    promo_code: typeof r.promo_code === 'string' && r.promo_code.trim() ? r.promo_code.trim() : null,
    image_urls: parseJsonStringArray(r.image_urls),
    details: parseJsonStringArray(r.details),
  }
}

function orderDisplayId(numericId: number): string {
  return `#ORD-${String(numericId).padStart(3, '0')}`
}

function toAdminOrder(r: OrderRow): AdminOrder {
  return {
    id: orderDisplayId(r.id),
    customer: r.customer,
    email: r.email,
    amount: r.amount,
    status: r.status,
    date: r.date,
    promo_code: typeof r.promo_code === 'string' && r.promo_code.trim() ? r.promo_code.trim() : null,
  }
}

function toPromoCode(r: PromoCodeRow): PromoCode {
  return {
    id: String(r.id),
    code: r.code.trim(),
    discount_type: r.discount_type === 'fixed' ? 'fixed' : 'percent',
    discount_value: Number(r.discount_value),
    valid_from: r.valid_from ?? null,
    valid_until: r.valid_until ?? null,
    max_uses: r.max_uses != null ? Number(r.max_uses) : null,
    times_used: Number(r.times_used) || 0,
    created_at: r.created_at ?? undefined,
  }
}

function parseOrderId(displayId: string): number | null {
  const match = displayId.replace(/^#ORD-0*/, '').replace(/^ORD-0*/, '')
  const n = parseInt(match, 10)
  return Number.isNaN(n) ? null : n
}

export async function fetchProducts(): Promise<AdminProduct[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, price, stock, status, colors, sizes, unisex, segment, new_arrival, discount_percent, promo_code, image_urls, details, created_at')
    .order('id', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => toAdminProduct(r as ProductRow))
}

export async function fetchProductById(id: string): Promise<AdminProduct | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, price, stock, status, colors, sizes, unisex, segment, new_arrival, discount_percent, promo_code, image_urls, details, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ? toAdminProduct(data as ProductRow) : null
}

export async function fetchOrders(): Promise<AdminOrder[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer, email, amount, status, date, promo_code, created_at')
    .order('id', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => toAdminOrder(r as OrderRow))
}

export async function addProductSupabase(
  p: Omit<AdminProduct, 'id' | 'status'>
): Promise<AdminProduct> {
  const supabase = createClient()
  const status = p.stock > 0 ? 'Active' : 'Out of Stock'
  const segment = p.segment === 'Men' || p.segment === 'Women' || p.segment === 'Unisex' ? p.segment : 'Unisex'
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      status,
      colors: p.colors ?? [],
      sizes: p.sizes ?? [],
      unisex: p.unisex === true,
      segment,
      new_arrival: p.new_arrival === true,
      discount_percent: p.discount_percent != null && p.discount_percent >= 0 && p.discount_percent <= 100 ? p.discount_percent : null,
      promo_code: typeof p.promo_code === 'string' && p.promo_code.trim() ? p.promo_code.trim() : null,
      image_urls: Array.isArray(p.image_urls) ? p.image_urls : [],
      details: Array.isArray(p.details) ? p.details : [],
    })
    .select('id, name, category, price, stock, status, colors, sizes, unisex, segment, new_arrival, discount_percent, promo_code, image_urls, details')
    .single()
  if (error) throw error
  return toAdminProduct({ ...data, colors: data.colors ?? [], sizes: data.sizes ?? [] } as ProductRow)
}

export async function updateProductSupabase(
  id: string,
  updates: Partial<AdminProduct>
): Promise<void> {
  const supabase = createClient()
  const payload: Record<string, unknown> = {}
  if (updates.name !== undefined) payload.name = updates.name
  if (updates.category !== undefined) payload.category = updates.category
  if (updates.price !== undefined) payload.price = updates.price
  if (updates.stock !== undefined) {
    payload.stock = updates.stock
    payload.status = updates.stock > 0 ? 'Active' : 'Out of Stock'
  }
  if (updates.colors !== undefined) payload.colors = updates.colors
  if (updates.sizes !== undefined) payload.sizes = updates.sizes
  if (updates.unisex !== undefined) payload.unisex = updates.unisex === true
  if (updates.segment !== undefined) payload.segment = updates.segment === 'Men' || updates.segment === 'Women' || updates.segment === 'Unisex' ? updates.segment : 'Unisex'
  if (updates.new_arrival !== undefined) payload.new_arrival = updates.new_arrival === true
  if (updates.discount_percent !== undefined) payload.discount_percent = updates.discount_percent != null && updates.discount_percent >= 0 && updates.discount_percent <= 100 ? updates.discount_percent : null
  if (updates.promo_code !== undefined) payload.promo_code = typeof updates.promo_code === 'string' && updates.promo_code.trim() ? updates.promo_code.trim() : null
  if (updates.image_urls !== undefined) payload.image_urls = Array.isArray(updates.image_urls) ? updates.image_urls : []
  if (updates.details !== undefined) payload.details = Array.isArray(updates.details) ? updates.details : []
  if (Object.keys(payload).length === 0) return
  const { error } = await supabase.from('products').update(payload).eq('id', id)
  if (error) throw error
}

export async function removeProductSupabase(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

function toProductTemplate(r: ProductTemplateRow): ProductTemplate {
  return {
    id: String(r.id),
    name: r.name,
    category: r.category,
    colors: r.colors ?? '',
    sizes: r.sizes ?? '',
    unisex: r.unisex === true,
  }
}

export async function fetchProductTemplates(): Promise<ProductTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('product_templates')
    .select('id, name, category, colors, sizes, unisex, created_at')
    .order('id', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => toProductTemplate(r as ProductTemplateRow))
}

export async function addProductTemplateSupabase(
  t: Omit<ProductTemplate, 'id'>
): Promise<ProductTemplate> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('product_templates')
    .insert({
      name: t.name,
      category: t.category,
      colors: t.colors ?? '',
      sizes: t.sizes ?? '',
      unisex: t.unisex === true,
    })
    .select('id, name, category, colors, sizes, unisex')
    .single()
  if (error) throw error
  return toProductTemplate(data as ProductTemplateRow)
}

export async function removeProductTemplateSupabase(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('product_templates').delete().eq('id', id)
  if (error) throw error
}

function toProductCategory(r: ProductCategoryRow): ProductCategory {
  return {
    id: String(r.id),
    name: r.name,
    sort_order: Number(r.sort_order) || 0,
  }
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name, sort_order')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => toProductCategory(r as ProductCategoryRow))
}

export async function addProductCategorySupabase(name: string): Promise<ProductCategory> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('product_categories')
    .insert({ name: name.trim(), sort_order: 999 })
    .select('id, name, sort_order')
    .single()
  if (error) throw error
  return toProductCategory(data as ProductCategoryRow)
}

export async function updateProductCategorySupabase(id: string, updates: { name?: string; sort_order?: number }): Promise<void> {
  const supabase = createClient()
  const payload: Record<string, unknown> = {}
  if (updates.name !== undefined) payload.name = updates.name.trim()
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order
  if (Object.keys(payload).length === 0) return
  const { error } = await supabase.from('product_categories').update(payload).eq('id', id)
  if (error) throw error
}

export async function removeProductCategorySupabase(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('product_categories').delete().eq('id', id)
  if (error) throw error
}

// ---------- Promo codes ----------

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, valid_from, valid_until, max_uses, times_used, created_at')
    .order('id', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => toPromoCode(r as PromoCodeRow))
}

export async function fetchPromoByCode(code: string): Promise<PromoCode | null> {
  const supabase = createClient()
  const normalized = code.trim().toUpperCase()
  if (!normalized) return null
  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, valid_from, valid_until, max_uses, times_used, created_at')
    .ilike('code', normalized)
    .maybeSingle()
  if (error) throw error
  return data ? toPromoCode(data as PromoCodeRow) : null
}

export type ValidatePromoResult =
  | { valid: true; code: string; discount_type: 'percent' | 'fixed'; discount_value: number }
  | { valid: false; error: string }

export async function validatePromoCode(code: string): Promise<ValidatePromoResult> {
  const promo = await fetchPromoByCode(code)
  if (!promo) return { valid: false, error: 'Invalid or expired code' }
  const now = new Date().toISOString()
  if (promo.valid_from && promo.valid_from > now) return { valid: false, error: 'Code not yet valid' }
  if (promo.valid_until && promo.valid_until < now) return { valid: false, error: 'Code has expired' }
  if (promo.max_uses != null && promo.times_used >= promo.max_uses) return { valid: false, error: 'Code usage limit reached' }
  if (promo.discount_type === 'percent' && (promo.discount_value <= 0 || promo.discount_value > 100))
    return { valid: false, error: 'Invalid discount' }
  if (promo.discount_type === 'fixed' && promo.discount_value <= 0) return { valid: false, error: 'Invalid discount' }
  return {
    valid: true,
    code: promo.code,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
  }
}

export async function addPromoCodeSupabase(p: Omit<PromoCode, 'id' | 'times_used' | 'created_at'>): Promise<PromoCode> {
  const supabase = createClient()
  const code = p.code.trim().toUpperCase()
  const { data, error } = await supabase
    .from('promo_codes')
    .insert({
      code,
      discount_type: p.discount_type,
      discount_value: p.discount_value,
      valid_from: p.valid_from && p.valid_from.trim() ? p.valid_from.trim() : null,
      valid_until: p.valid_until && p.valid_until.trim() ? p.valid_until.trim() : null,
      max_uses: p.max_uses != null && p.max_uses >= 0 ? p.max_uses : null,
      times_used: 0,
    })
    .select('id, code, discount_type, discount_value, valid_from, valid_until, max_uses, times_used, created_at')
    .single()
  if (error) throw error
  return toPromoCode(data as PromoCodeRow)
}

export async function updatePromoCodeSupabase(id: string, updates: Partial<Omit<PromoCode, 'id'>>): Promise<void> {
  const supabase = createClient()
  const payload: Record<string, unknown> = {}
  if (updates.code !== undefined) payload.code = updates.code.trim().toUpperCase()
  if (updates.discount_type !== undefined) payload.discount_type = updates.discount_type
  if (updates.discount_value !== undefined) payload.discount_value = updates.discount_value
  if (updates.valid_from !== undefined) payload.valid_from = updates.valid_from && updates.valid_from.trim() ? updates.valid_from.trim() : null
  if (updates.valid_until !== undefined) payload.valid_until = updates.valid_until && updates.valid_until.trim() ? updates.valid_until.trim() : null
  if (updates.max_uses !== undefined) payload.max_uses = updates.max_uses != null && updates.max_uses >= 0 ? updates.max_uses : null
  if (Object.keys(payload).length === 0) return
  const { error } = await supabase.from('promo_codes').update(payload).eq('id', id)
  if (error) throw error
}

export async function removePromoCodeSupabase(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('promo_codes').delete().eq('id', id)
  if (error) throw error
}

export async function incrementPromoTimesUsed(code: string): Promise<void> {
  const supabase = createClient()
  const normalized = code.trim().toUpperCase()
  const { data: row } = await supabase.from('promo_codes').select('id, times_used').ilike('code', normalized).maybeSingle()
  if (!row) return
  const { error } = await supabase.from('promo_codes').update({ times_used: (row as { times_used: number }).times_used + 1 }).eq('id', (row as { id: number }).id)
  if (error) throw error
}

export async function addOrderSupabase(
  order: Omit<AdminOrder, 'id'> & { promo_code?: string | null }
): Promise<AdminOrder> {
  const supabase = createClient()
  const promoCode = order.promo_code && order.promo_code.trim() ? order.promo_code.trim() : null
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer: order.customer,
      email: order.email,
      amount: order.amount,
      status: order.status,
      date: order.date,
      promo_code: promoCode,
    })
    .select('id, customer, email, amount, status, date, promo_code')
    .single()
  if (error) throw error
  if (promoCode) await incrementPromoTimesUsed(promoCode)
  return toAdminOrder(data as OrderRow)
}

export async function updateOrderStatusSupabase(
  orderDisplayId: string,
  status: string
): Promise<void> {
  const id = parseOrderId(orderDisplayId)
  if (id == null) throw new Error('Invalid order id')
  const supabase = createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}
