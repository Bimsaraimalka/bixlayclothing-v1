'use client'

import { useState, useMemo, useEffect } from 'react'
import { Package, Send, RotateCcw, CheckCircle, Eye, Download, Plus, Search } from 'lucide-react'
import { useAdminData } from '@/components/admin/admin-data-context'
import { buildCsv, downloadCsv } from '@/lib/csv'
import { addOrderWithItems, fetchOrderItems } from '@/lib/supabase-data'
import { formatPrice } from '@/lib/utils'
import type { OrderItem, AdminProduct } from '@/lib/admin-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Tab = 'queue' | 'sent' | 'completed' | 'returned'

type OrderForDetails = {
  id: string
  customer: string
  email: string
  amount: string
  status: string
  date: string
  payment_method?: string | null
  promo_code?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
  product_id?: string | null
  product_name?: string | null
  color?: string | null
  size?: string | null
  quantity?: number | null
  unit_price?: number | null
  order_source?: string | null
  order_source_other?: string | null
}

function statusStyle(status: string): string {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    case 'Shipped':
      return 'bg-primary/10 text-primary'
    case 'Pending':
    case 'Returned':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
    case 'Cancelled':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-foreground'
  }
}

function paymentMethodLabel(method: string | null | undefined): string {
  if (!method) return '—'
  switch (method) {
    case 'bank_transfer': return 'Bank transfer'
    case 'card': return 'Card'
    case 'cash_on_delivery': return 'Cash on delivery'
    default: return method
  }
}

const ORDER_SOURCE_OPTIONS = [
  { value: '', label: 'Select source' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone_call', label: 'Phone call' },
  { value: 'other', label: 'Other' },
] as const

function orderSourceLabel(source: string | null | undefined, other: string | null | undefined): string {
  if (!source) return '—'
  const opt = ORDER_SOURCE_OPTIONS.find((o) => o.value === source)
  if (source === 'other' && (other ?? '').trim()) return `Other: ${other!.trim()}`
  return opt ? opt.label : source
}

function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  statusStyle,
}: {
  order: OrderForDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  statusStyle: (status: string) => string
}) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)

  useEffect(() => {
    if (!order?.id || !open) {
      setItems([])
      return
    }
    setItemsLoading(true)
    fetchOrderItems(order.id)
      .then(setItems)
      .finally(() => setItemsLoading(false))
  }, [order?.id, open])

  const displayItems: OrderItem[] = useMemo(() => {
    if (items.length > 0) return items
    if (order?.product_name || order?.product_id) {
      const qty = order.quantity ?? 1
      const up = order.unit_price ?? 0
      return [{
        id: 'legacy',
        order_id: order.id,
        product_id: order.product_id ?? null,
        product_name: order.product_name ?? null,
        color: order.color ?? null,
        size: order.size ?? null,
        quantity: qty,
        unit_price: up,
        discount_amount: 0,
        line_total: qty * up,
      }]
    }
    return []
  }, [items, order])

  if (!order) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Order {order.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Customer & contact</h3>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{order.customer || '—'}</span>
              <span className="text-muted-foreground">Email</span>
              <span className="break-all">{order.email || '—'}</span>
              <span className="text-muted-foreground">Phone</span>
              <span>{(order.phone ?? '').trim() || '—'}</span>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Shipping address</h3>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Address</span>
              <span>{(order.address ?? '').trim() || '—'}</span>
              <span className="text-muted-foreground">City</span>
              <span>{(order.city ?? '').trim() || '—'}</span>
              <span className="text-muted-foreground">State (optional)</span>
              <span>{(order.state ?? '').trim() || '—'}</span>
              <span className="text-muted-foreground">ZIP code (optional)</span>
              <span>{(order.zip_code ?? '').trim() || '—'}</span>
              <span className="text-muted-foreground">Country</span>
              <span>{(order.country ?? '').trim() || 'Sri Lanka'}</span>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Products</h3>
            {itemsLoading ? (
              <p className="text-sm text-muted-foreground">Loading items…</p>
            ) : displayItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No line items</p>
            ) : (
              <div className="space-y-2">
                {displayItems.map((it, i) => (
                  <div key={it.id} className="text-sm py-2 border-b border-border last:border-0">
                    <p className="font-medium text-foreground">{it.product_name || `Product ${it.product_id || i + 1}`}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {[it.color, it.size].filter(Boolean).join(' · ')}
                      {' · '}Qty {it.quantity} × {formatPrice(it.unit_price)}
                      {it.discount_amount > 0 && ` − ${formatPrice(it.discount_amount)} discount`}
                    </p>
                    <p className="font-medium text-foreground mt-1">{formatPrice(it.line_total)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Order & payment</h3>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{order.date || '—'}</span>
              <span className="text-muted-foreground">Status</span>
              <span>
                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
              </span>
              <span className="text-muted-foreground">Payment</span>
              <span>{paymentMethodLabel(order.payment_method)}</span>
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-primary">{order.amount || '—'}</span>
              <span className="text-muted-foreground">Promo code</span>
              <span>{(order.promo_code ?? '').trim() || '—'}</span>
              <span className="text-muted-foreground">Order from</span>
              <span>{orderSourceLabel(order.order_source, order.order_source_other)}</span>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OrderTable({
  orders,
  updateOrderStatus,
  orderStatuses,
  emptyMessage,
  onViewOrder,
  statusStyle,
}: {
  orders: OrderForDetails[]
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
  orderStatuses: readonly string[]
  emptyMessage: string
  onViewOrder: (order: OrderForDetails) => void
  statusStyle: (status: string) => string
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  return (
    <>
      {/* Mobile: order cards */}
      <div className="md:hidden divide-y divide-border">
        {orders.length === 0 ? (
          <p className="py-8 px-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-foreground">{order.id}</p>
                <span className={`shrink-0 inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-foreground mt-1">{order.customer}</p>
              <p className="text-xs text-muted-foreground truncate">{order.email}</p>
              <p className="text-sm font-medium text-foreground mt-1">{order.amount} · {order.date}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Payment: {paymentMethodLabel(order.payment_method)}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] touch-manipulation"
                  onClick={() => onViewOrder(order)}
                >
                  <Eye size={18} className="mr-1.5" />
                  View details
                </Button>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={async (e) => {
                    const status = e.target.value
                    setUpdatingId(order.id)
                    try {
                      await updateOrderStatus(order.id, status)
                    } finally {
                      setUpdatingId(null)
                    }
                  }}
                  className="flex-1 min-h-[44px] px-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation disabled:opacity-50"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 lg:px-6 font-medium text-foreground">{order.id}</td>
                <td className="py-3 px-4 lg:px-6 text-foreground">{order.customer}</td>
                <td className="py-3 px-4 lg:px-6 text-muted-foreground text-sm">{order.email}</td>
                <td className="py-3 px-4 lg:px-6 font-medium text-foreground">{order.amount}</td>
                <td className="py-3 px-4 lg:px-6 text-sm text-muted-foreground">{paymentMethodLabel(order.payment_method)}</td>
                <td className="py-3 px-4 lg:px-6">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 lg:px-6 text-sm text-muted-foreground">{order.date}</td>
                <td className="py-3 px-4 lg:px-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => onViewOrder(order)}
                  >
                    <Eye size={16} />
                    View
                  </Button>
                </td>
                <td className="py-3 px-4 lg:px-6">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={async (e) => {
                      const status = e.target.value
                      setUpdatingId(order.id)
                      try {
                        await updateOrderStatus(order.id, status)
                      } finally {
                        setUpdatingId(null)
                      }
                    }}
                    className="h-9 px-3 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </>
  )
}

type AddOrderLine = {
  productId: string
  productName: string
  color: string
  size: string
  quantity: number
  unitPrice: number
  discountAmount: number
}

const emptyLine = (): AddOrderLine => ({
  productId: '',
  productName: '',
  color: '',
  size: '',
  quantity: 1,
  unitPrice: 0,
  discountAmount: 0,
})

const emptyAddOrderForm = () => ({
  lines: [emptyLine()] as AddOrderLine[],
  customer: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Sri Lanka',
  paymentMethod: 'cash_on_delivery' as const,
  orderSource: '',
  orderSourceOther: '',
})

export function AdminOrders() {
  const { orders, products, updateOrderStatus, orderStatuses, loading, error, refetch } = useAdminData()
  const [tab, setTab] = useState<Tab>('queue')
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<OrderForDetails | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addProductPickerOpen, setAddProductPickerOpen] = useState(false)
  const [addProductSearch, setAddProductSearch] = useState('')
  const [addForm, setAddForm] = useState(emptyAddOrderForm())
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState('')

  const orderTotalFromLines = useMemo(() => {
    return addForm.lines.reduce((sum, line) => {
      const lineTotal = Math.max(0, line.quantity * line.unitPrice - line.discountAmount)
      return sum + lineTotal
    }, 0)
  }, [addForm.lines])

  const totalDiscountFromLines = useMemo(() => {
    return addForm.lines.reduce((sum, line) => sum + (line.discountAmount ?? 0), 0)
  }, [addForm.lines])

  const updateLine = (index: number, upd: Partial<AddOrderLine>) => {
    setAddForm((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) => (i === index ? { ...l, ...upd } : l)),
    }))
  }

  const addLine = () => {
    setAddForm((prev) => ({ ...prev, lines: [...prev.lines, emptyLine()] }))
  }

  const addLineFromProduct = (p: AdminProduct) => {
    const newLine: AddOrderLine = {
      productId: p.id,
      productName: p.name,
      color: p.colors?.[0] ?? '',
      size: p.sizes?.[0] ?? '',
      quantity: 1,
      unitPrice: p.price,
      discountAmount: 0,
    }
    setAddForm((prev) => ({ ...prev, lines: [...prev.lines, newLine] }))
    setAddProductPickerOpen(false)
    setAddProductSearch('')
  }

  const filteredProductsForPicker = useMemo(() => {
    const q = addProductSearch.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
    )
  }, [products, addProductSearch])

  const removeLine = (index: number) => {
    setAddForm((prev) => ({
      ...prev,
      lines: prev.lines.length > 1 ? prev.lines.filter((_, i) => i !== index) : prev.lines,
    }))
  }

  const handleViewOrder = (order: OrderForDetails) => {
    setDetailsOrder(order)
    setDetailsOpen(true)
  }

  const handleDownloadOrdersCsv = () => {
    const headers = [
      'Order ID', 'Customer', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP Code', 'Country',
      'Product', 'Color', 'Size', 'Quantity', 'Unit price', 'Amount', 'Status', 'Date', 'Payment', 'Promo code', 'Order from',
    ]
    const rows = orders.map((o) => [
      o.id,
      o.customer,
      o.email,
      o.phone ?? '',
      o.address ?? '',
      o.city ?? '',
      o.state ?? '',
      o.zip_code ?? '',
      o.country ?? '',
      o.product_name ?? '',
      o.color ?? '',
      o.size ?? '',
      o.quantity ?? '',
      o.unit_price != null ? formatPrice(o.unit_price) : '',
      o.amount,
      o.status,
      o.date,
      paymentMethodLabel(o.payment_method),
      o.promo_code ?? '',
      orderSourceLabel(o.order_source, o.order_source_other),
    ])
    const csv = buildCsv(headers, rows)
    downloadCsv(csv, `orders-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const inQueue = orders.filter((o) => o.status === 'Pending')
  const sent = orders.filter((o) => o.status === 'Shipped')
  const completed = orders.filter((o) => o.status === 'Completed')
  const returned = orders.filter((o) => o.status === 'Returned')

  const filterBySearch = <T extends { id: string; customer: string; email: string }>(list: T[]) =>
    search.trim()
      ? list.filter(
          (o) =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            o.email.toLowerCase().includes(search.toLowerCase())
        )
      : list

  const queueFiltered = filterBySearch(inQueue)
  const sentFiltered = filterBySearch(sent)
  const completedFiltered = filterBySearch(completed)
  const returnedFiltered = filterBySearch(returned)

  const totalRevenue = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + Number(o.amount.replace(/[^0-9.]/g, '')) || 0, 0)

  const tabs: { key: Tab; label: string; count: number; icon: typeof Package }[] = [
    { key: 'queue', label: 'In queue', count: inQueue.length, icon: Package },
    { key: 'sent', label: 'Shipped', count: sent.length, icon: Send },
    { key: 'completed', label: 'Completed', count: completed.length, icon: CheckCircle },
    { key: 'returned', label: 'Returned', count: returned.length, icon: RotateCcw },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading orders…</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">View sent orders, returns, and orders in queue</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 min-h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
        />
        <Button
          type="button"
          className="min-h-[44px] gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            setAddForm(emptyAddOrderForm())
            setAddError('')
            setAddOpen(true)
          }}
        >
          <Plus size={18} />
          Add order
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-[44px] gap-2 shrink-0"
          onClick={handleDownloadOrdersCsv}
        >
          <Download size={18} />
          Download CSV
        </Button>
      </div>

      {/* Add order dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) setAddError('') }}>
        <DialogContent className="flex flex-col w-[95vw] max-w-[1600px] sm:w-[95vw] sm:max-w-[1600px] max-h-[90vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="shrink-0 border-b border-border px-4 sm:px-6 pr-14 sm:pr-14 py-4">
            <DialogTitle className="text-xl font-semibold">Add new order</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col flex-1 min-h-0"
            onSubmit={async (e) => {
              e.preventDefault()
              setAddError('')
              if (!addForm.customer.trim() || !addForm.email.trim()) {
                setAddError('Customer name and email are required.')
                return
              }
              const validLines = addForm.lines.filter(
                (l) => l.quantity > 0 && (l.unitPrice > 0 || l.productId)
              )
              if (validLines.length === 0) {
                setAddError('Add at least one product with quantity and price.')
                return
              }
              setAddSubmitting(true)
              try {
                await addOrderWithItems(
                  {
                    customer: addForm.customer.trim(),
                    email: addForm.email.trim(),
                    amount: formatPrice(orderTotalFromLines),
                    status: 'Pending',
                    date: new Date().toISOString().slice(0, 10),
                    payment_method: addForm.paymentMethod,
                    phone: addForm.phone.trim() || null,
                    address: addForm.address.trim() || null,
                    city: addForm.city.trim() || null,
                    state: addForm.state.trim() || null,
                    zip_code: addForm.zipCode.trim() || null,
                    country: (addForm.country.trim() || 'Sri Lanka'),
                    order_source: addForm.orderSource.trim() || null,
                    order_source_other: addForm.orderSource === 'other' ? (addForm.orderSourceOther.trim() || null) : null,
                  },
                  validLines.map((l) => ({
                    product_id: l.productId || null,
                    product_name: l.productName || null,
                    color: l.color.trim() || null,
                    size: l.size.trim() || null,
                    quantity: l.quantity,
                    unit_price: l.unitPrice,
                    discount_amount: l.discountAmount ?? 0,
                  }))
                )
                await refetch()
                setAddOpen(false)
                setAddForm(emptyAddOrderForm())
              } catch (err) {
                setAddError(err instanceof Error ? err.message : 'Failed to create order')
              } finally {
                setAddSubmitting(false)
              }
            }}
          >
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:grid-rows-[1fr] lg:min-h-full">
            {/* Left column: Products */}
            <div className="flex flex-col min-w-0 min-h-0 flex-1">
              <div className="flex items-center justify-between shrink-0">
                <h4 className="text-sm font-semibold text-foreground">Products</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => setAddProductPickerOpen(true)}>
                  <Plus size={16} className="mr-1" />
                  Add product
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 mt-3">
              {addForm.lines.map((line, index) => {
                const product = products.find((p) => p.id === line.productId)
                const lineTotal = Math.max(0, line.quantity * line.unitPrice - line.discountAmount)
                return (
                  <div key={index} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Line {index + 1}</span>
                      {addForm.lines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => removeLine(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <select
                      value={line.productId}
                      onChange={(e) => {
                        const id = e.target.value
                        const p = products.find((x) => x.id === id)
                        updateLine(index, {
                          productId: id,
                          productName: p?.name ?? '',
                          color: p?.colors?.[0] ?? '',
                          size: p?.sizes?.[0] ?? '',
                          unitPrice: p?.price ?? 0,
                        })
                      }}
                      className="w-full min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} – {formatPrice(p.price)}</option>
                      ))}
                    </select>
                    {product && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={line.color}
                          onChange={(e) => updateLine(index, { color: e.target.value })}
                          className="min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {(product.colors ?? []).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          value={line.size}
                          onChange={(e) => updateLine(index, { size: e.target.value })}
                          className="min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {(product.sizes ?? []).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground block">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => updateLine(index, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                          className="w-full min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block">Unit price</label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={line.unitPrice || ''}
                          onChange={(e) => updateLine(index, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                          className="w-full min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block">Discount (Rs)</label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={line.discountAmount || ''}
                          onChange={(e) => updateLine(index, { discountAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                          className="w-full min-h-[40px] px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block">Line total</label>
                        <div className="min-h-[40px] px-3 rounded-lg border border-border bg-muted/50 flex items-center text-sm font-medium text-foreground">
                          {formatPrice(lineTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>

            {/* Right column: Customer details */}
            <div className="space-y-3 min-w-0 flex flex-col pb-6">
              <h4 className="text-sm font-semibold text-foreground">Customer & delivery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Customer name"
                  value={addForm.customer}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, customer: e.target.value }))}
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone"
                value={addForm.phone}
                onChange={(e) => setAddForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Address"
                value={addForm.address}
                onChange={(e) => setAddForm((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={addForm.city}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="State (optional)"
                  value={addForm.state}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, state: e.target.value }))}
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ZIP code (optional)"
                  value={addForm.zipCode}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={addForm.country}
                  readOnly
                  className="min-h-[44px] px-3 rounded-lg border border-border bg-muted/50 text-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Order from</label>
                <select
                  value={addForm.orderSource}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, orderSource: e.target.value, orderSourceOther: e.target.value === 'other' ? prev.orderSourceOther : '' }))}
                  className="w-full min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {ORDER_SOURCE_OPTIONS.map((o) => (
                    <option key={o.value || 'none'} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {addForm.orderSource === 'other' && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Specify other</label>
                  <input
                    type="text"
                    placeholder="e.g. Walk-in, Referral"
                    value={addForm.orderSourceOther}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, orderSourceOther: e.target.value }))}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Payment method</label>
                <select
                  value={addForm.paymentMethod}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, paymentMethod: e.target.value as 'bank_transfer' | 'card' | 'cash_on_delivery' }))}
                  className="w-full min-h-[44px] px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="card">Visa, Debit & Mastercard</option>
                  <option value="cash_on_delivery">Cash on delivery</option>
                </select>
              </div>
            </div>
            </div>
            </div>

            {/* Fixed footer */}
            <div className="shrink-0 border-t border-border px-4 sm:px-6 py-4 bg-background flex flex-col gap-3">
              {addError && <p className="text-sm text-destructive">{addError}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-baseline gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Total discount: <span className="font-semibold text-foreground">{formatPrice(totalDiscountFromLines)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Order total: <span className="font-semibold text-foreground">{formatPrice(orderTotalFromLines)}</span>
                  </span>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={addSubmitting} className="min-h-[44px]">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addSubmitting} className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90">
                    {addSubmitting ? 'Creating…' : 'Create order'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add product picker dialog */}
      <Dialog open={addProductPickerOpen} onOpenChange={setAddProductPickerOpen}>
        <DialogContent className="flex flex-col w-[95vw] sm:w-[95vw] max-w-[900px] sm:max-w-[900px] max-h-[85vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="shrink-0 border-b border-border px-4 sm:px-6 py-4 pr-14">
            <DialogTitle className="text-xl font-semibold">Select product</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
            <div className="relative shrink-0 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by product ID, name or category..."
                value={addProductSearch}
                onChange={(e) => setAddProductSearch(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filteredProductsForPicker.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addLineFromProduct(p)}
                    className="flex flex-col rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-colors text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <div className="aspect-square bg-muted/50 relative overflow-hidden">
                      {p.image_urls?.[0] ? (
                        <img
                          src={p.image_urls[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="size-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-0.5">
                      <span className="font-medium text-foreground line-clamp-2">{p.name}</span>
                      <span className="text-sm text-muted-foreground">{p.category}</span>
                      <span className="text-sm font-semibold text-foreground mt-1">{formatPrice(p.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
              {filteredProductsForPicker.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No products match your search.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">In queue</p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">{inQueue.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Shipped</p>
          <p className="text-xl sm:text-2xl font-semibold text-primary">{sent.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Completed</p>
          <p className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{completed.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Returned</p>
          <p className="text-xl sm:text-2xl font-semibold text-amber-600 dark:text-amber-400">{returned.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Revenue</p>
          <p className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">Rs. {Math.round(totalRevenue)}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto -mx-1 px-1 scrollbar-thin touch-pan-x">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors min-h-[44px] touch-manipulation ${
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            <Icon size={18} />
            {label}
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">{count}</span>
          </button>
        ))}
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        {tab === 'queue' && (
          <OrderTable
            orders={queueFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No orders in queue."
            onViewOrder={handleViewOrder}
            statusStyle={statusStyle}
          />
        )}
        {tab === 'sent' && (
          <OrderTable
            orders={sentFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No shipped orders."
            onViewOrder={handleViewOrder}
            statusStyle={statusStyle}
          />
        )}
        {tab === 'completed' && (
          <OrderTable
            orders={completedFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No completed orders."
            onViewOrder={handleViewOrder}
            statusStyle={statusStyle}
          />
        )}
        {tab === 'returned' && (
          <OrderTable
            orders={returnedFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No returned orders."
            onViewOrder={handleViewOrder}
            statusStyle={statusStyle}
          />
        )}
      </div>

      <OrderDetailsDialog
        order={detailsOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        statusStyle={statusStyle}
      />
    </div>
  )
}
