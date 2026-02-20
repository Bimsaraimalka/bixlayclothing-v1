'use client'

import { TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react'

const STATS = [
  {
    title: 'Total Revenue',
    value: 'Rs. 24,580.00',
    change: '+12.5%',
    icon: DollarSign,
    color: 'accent',
  },
  {
    title: 'Total Orders',
    value: '1,248',
    change: '+8.2%',
    icon: ShoppingBag,
    color: 'primary',
  },
  {
    title: 'Total Products',
    value: '156',
    change: '+4.1%',
    icon: Package,
    color: 'secondary',
  },
  {
    title: 'Growth Rate',
    value: '23.5%',
    change: '+2.3%',
    icon: TrendingUp,
    color: 'accent',
  },
]

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-background border border-border rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon size={20} className="text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-accent font-medium">
                  {stat.change} from last month
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-xl font-serif font-bold text-primary mb-6">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: '#ORD-001',
                  customer: 'John Doe',
                  amount: 'Rs. 249.99',
                  status: 'Completed',
                  date: '2024-02-15',
                },
                {
                  id: '#ORD-002',
                  customer: 'Jane Smith',
                  amount: 'Rs. 189.99',
                  status: 'Pending',
                  date: '2024-02-14',
                },
                {
                  id: '#ORD-003',
                  customer: 'Bob Johnson',
                  amount: 'Rs. 399.99',
                  status: 'Shipped',
                  date: '2024-02-13',
                },
              ].map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 text-foreground font-bold">
                    {order.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed'
                          ? 'bg-accent/10 text-accent'
                          : order.status === 'Pending'
                          ? 'bg-muted text-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
