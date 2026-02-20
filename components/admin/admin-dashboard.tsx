'use client'

import { TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useAdminData } from '@/components/admin/admin-data-context'

export function AdminDashboard() {
  const { products, orders, totalRevenue, totalOrders, loading, error } = useAdminData()
  const completedOrders = orders.filter((o) => o.status === 'Completed' || o.status === 'Shipped').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading dashboard…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive space-y-3">
        <p className="font-medium">Failed to load dashboard</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs text-muted-foreground pt-2 border-t border-destructive/20">
          If the error mentions &quot;products&quot; or &quot;orders&quot; or &quot;relation&quot;, run the database migration in Supabase: SQL Editor → paste and run <code className="bg-destructive/20 px-1 rounded">supabase/migrations/20250220000000_products_orders.sql</code>. See docs/ADMIN_SUPABASE_SETUP.md.
        </p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      sub: 'From completed & shipped orders',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: String(totalOrders),
      sub: `${completedOrders} completed`,
      icon: ShoppingBag,
    },
    {
      title: 'Total Products',
      value: String(products.length),
      sub: `${products.filter((p) => p.status === 'Active').length} active`,
      icon: Package,
    },
    {
      title: 'Growth',
      value: '—',
      sub: 'Connect analytics for trends',
      icon: TrendingUp,
    },
  ]

  const statusBadge = (status: string) => {
    const base = 'inline-flex px-2.5 py-1 rounded-md text-xs font-medium'
    const style =
      status === 'Completed'
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
        : status === 'Pending'
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : status === 'Shipped'
        ? 'bg-primary/10 text-primary'
        : 'bg-destructive/10 text-destructive'
    return <span className={`${base} ${style}`}>{status}</span>
  }

  const recentOrders = orders.slice(0, 8)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of revenue, orders, and products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-5 space-y-2 sm:space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Orders</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Latest orders across all statuses</p>
        </div>

        {/* Mobile: card list */}
        <div className="md:hidden divide-y divide-border">
          {recentOrders.length === 0 ? (
            <p className="py-8 px-4 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 active:bg-muted/30">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-medium text-foreground">{order.id}</p>
                  {statusBadge(order.status)}
                </div>
                <p className="text-sm text-foreground mt-1">{order.customer}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{order.amount} · {order.date}</p>
              </div>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 sm:px-6 text-foreground">{order.customer}</td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-foreground">{order.amount}</td>
                    <td className="py-3 px-4 sm:px-6">{statusBadge(order.status)}</td>
                    <td className="py-3 px-4 sm:px-6 text-sm text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
