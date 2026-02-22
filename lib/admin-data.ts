/** Audience segment for filtering on Men / Women pages. */
export type ProductSegment = 'Men' | 'Women' | 'Unisex'

export const PRODUCT_SEGMENTS: ProductSegment[] = ['Men', 'Women', 'Unisex']

/** Fallback when no categories in DB (e.g. before migration). */
export const DEFAULT_CATEGORY_NAMES = [
  'T-Shirts', 'Crop Tops', 'Pants', 'Dresses', 'Shirts', 'Jackets', 'Shorts', 'Skirts', 'Unisex',
] as const

export type ProductCategory = {
  id: string
  name: string
  sort_order: number
}

export type AdminProduct = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  colors: string[]
  sizes: string[]
  unisex?: boolean
  /** Men / Women / Unisex – used on Men and Women storefront pages. */
  segment?: ProductSegment
  /** Show in New Arrivals section on home and /new-arrivals. */
  new_arrival?: boolean
  /** Optional discount percentage (0–100). */
  discount_percent?: number | null
  /** Optional promo code (e.g. SAVE10) for this product. */
  promo_code?: string | null
  /** Image URLs for this product (uploaded). */
  image_urls?: string[]
  /** Product details bullets (shown on product detail page). */
  details?: string[]
}

/** Image library entry, grouped by category for product image sets. */
export type LibraryImage = {
  id: string
  category: string
  url: string
  /** Storage path for deletion from bucket (null if added by URL). */
  storage_path: string | null
  label: string | null
}

export type AdminOrder = {
  id: string
  customer: string
  email: string
  amount: string
  status: string
  date: string
  promo_code?: string | null
  /** Payment method: bank_transfer | card | cash_on_delivery */
  payment_method?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
  /** Product line (admin-created orders) */
  product_id?: string | null
  product_name?: string | null
  color?: string | null
  size?: string | null
  quantity?: number | null
  unit_price?: number | null
  /** Order source: facebook | instagram | whatsapp | phone_call | other */
  order_source?: string | null
  /** When order_source is 'other', specific text from customer */
  order_source_other?: string | null
}

/** Single line item on an order (from order_items table) */
export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string | null
  color: string | null
  size: string | null
  quantity: number
  unit_price: number
  discount_amount: number
  /** quantity * unit_price - discount_amount */
  line_total: number
}

/** Site-wide promo code (admin-created; applied at cart). */
export type PromoCode = {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  valid_from: string | null
  valid_until: string | null
  max_uses: number | null
  times_used: number
  created_at?: string
}

/** Saved product template for quick-add when creating products. */
export type ProductTemplate = {
  id: string
  name: string
  category: string
  colors: string
  sizes: string
  unisex: boolean
}

const PRODUCTS_KEY = 'bixlay_admin_products'
const ORDERS_KEY = 'bixlay_admin_orders'

const DEFAULT_PRODUCTS: AdminProduct[] = [
  { id: '1', name: 'Classic T-Shirt', category: 'T-Shirts', price: 30, stock: 150, status: 'Active', colors: ['Black', 'White', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], unisex: true },
  { id: '2', name: 'Denim Pants', category: 'Pants', price: 80, stock: 45, status: 'Active', colors: ['Dark Blue', 'Light Blue', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], unisex: false },
  { id: '3', name: 'Lace Crop Top', category: 'Crop Tops', price: 50, stock: 28, status: 'Active', colors: ['White', 'Black', 'Pink'], sizes: ['XS', 'S', 'M', 'L'], unisex: false },
]

const DEFAULT_ORDERS: AdminOrder[] = [
  { id: '#ORD-001', customer: 'John Doe', email: 'john@example.com', amount: 'Rs. 249', status: 'Completed', date: '2024-02-15' },
  { id: '#ORD-002', customer: 'Jane Smith', email: 'jane@example.com', amount: 'Rs. 190', status: 'Pending', date: '2024-02-14' },
  { id: '#ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', amount: 'Rs. 400', status: 'Shipped', date: '2024-02-13' },
  { id: '#ORD-004', customer: 'Alice Williams', email: 'alice@example.com', amount: 'Rs. 160', status: 'Returned', date: '2024-02-12' },
  { id: '#ORD-005', customer: 'Charlie Brown', email: 'charlie@example.com', amount: 'Rs. 580', status: 'Completed', date: '2024-02-11' },
]

function ensureProductShape(p: AdminProduct): AdminProduct {
  const discount = p.discount_percent != null ? Math.min(100, Math.max(0, Number(p.discount_percent))) : null
  return {
    ...p,
    colors: Array.isArray(p.colors) ? p.colors : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    unisex: p.unisex === true,
    discount_percent: discount !== null && !Number.isNaN(discount) ? discount : null,
    promo_code: typeof p.promo_code === 'string' && p.promo_code.trim() ? p.promo_code.trim() : null,
  }
}

function loadProducts(): AdminProduct[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS
  try {
    const s = localStorage.getItem(PRODUCTS_KEY)
    if (s) {
      const parsed = JSON.parse(s) as AdminProduct[]
      return parsed.map(ensureProductShape)
    }
  } catch {}
  return DEFAULT_PRODUCTS
}

function saveProducts(products: AdminProduct[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

function loadOrders(): AdminOrder[] {
  if (typeof window === 'undefined') return DEFAULT_ORDERS
  try {
    const s = localStorage.getItem(ORDERS_KEY)
    if (s) return JSON.parse(s)
  } catch {}
  return DEFAULT_ORDERS
}

function saveOrders(orders: AdminOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getStoredProducts(): AdminProduct[] {
  return loadProducts()
}

export function getStoredOrders(): AdminOrder[] {
  return loadOrders()
}

export function persistProducts(products: AdminProduct[]) {
  saveProducts(products)
}

export function persistOrders(orders: AdminOrder[]) {
  saveOrders(orders)
}

export function parseAmount(amountStr: string): number {
  const num = amountStr.replace(/[^0-9.]/g, '')
  return parseFloat(num) || 0
}

/** Generate next order ID (#ORD-006, #ORD-007, ...) */
function nextOrderId(): string {
  const orders = loadOrders()
  const numbers = orders
    .map((o) => o.id.replace(/^#ORD-0*/, ''))
    .map((n) => parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))
  const next = numbers.length ? Math.max(...numbers) + 1 : 1
  return `#ORD-${String(next).padStart(3, '0')}`
}

/** Add a new order (e.g. from checkout). Persists to localStorage and returns the order with id. */
export function addOrder(order: Omit<AdminOrder, 'id'>): AdminOrder {
  const withId: AdminOrder = { ...order, id: nextOrderId() }
  const orders = loadOrders()
  saveOrders([...orders, withId])
  return withId
}
