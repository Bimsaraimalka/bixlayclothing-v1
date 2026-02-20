'use client'

import { useState } from 'react'
import { Eye, Package, Send, RotateCcw } from 'lucide-react'
import { useAdminData } from '@/components/admin/admin-data-context'

type Tab = 'queue' | 'sent' | 'returned'

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

function OrderTable({
  orders,
  updateOrderStatus,
  orderStatuses,
  emptyMessage,
}: {
  orders: { id: string; customer: string; email: string; amount: string; status: string; date: string }[]
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
  orderStatuses: readonly string[]
  emptyMessage: string
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
                className="mt-3 w-full min-h-[44px] px-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation disabled:opacity-50"
              >
                {orderStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
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
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 lg:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
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
                <td className="py-3 px-4 lg:px-6">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 lg:px-6 text-sm text-muted-foreground">{order.date}</td>
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

export function AdminOrders() {
  const { orders, updateOrderStatus, orderStatuses, loading, error } = useAdminData()
  const [tab, setTab] = useState<Tab>('queue')
  const [search, setSearch] = useState('')

  const inQueue = orders.filter((o) => o.status === 'Pending')
  const sent = orders.filter((o) => o.status === 'Shipped' || o.status === 'Completed')
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
  const returnedFiltered = filterBySearch(returned)

  const totalRevenue = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + Number(o.amount.replace(/[^0-9.]/g, '')) || 0, 0)

  const tabs: { key: Tab; label: string; count: number; icon: typeof Package }[] = [
    { key: 'queue', label: 'In queue', count: inQueue.length, icon: Package },
    { key: 'sent', label: 'Sent', count: sent.length, icon: Send },
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

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 min-h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-sm touch-manipulation"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">In queue</p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">{inQueue.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Sent</p>
          <p className="text-xl sm:text-2xl font-semibold text-primary">{sent.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Returned</p>
          <p className="text-xl sm:text-2xl font-semibold text-amber-600 dark:text-amber-400">{returned.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 text-center min-h-[72px] flex flex-col justify-center col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Revenue (sent)</p>
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
          />
        )}
        {tab === 'sent' && (
          <OrderTable
            orders={sentFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No sent orders."
          />
        )}
        {tab === 'returned' && (
          <OrderTable
            orders={returnedFiltered}
            updateOrderStatus={updateOrderStatus}
            orderStatuses={orderStatuses}
            emptyMessage="No returned orders."
          />
        )}
      </div>
    </div>
  )
}
