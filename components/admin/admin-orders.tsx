'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'

const ORDERS_LIST = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    amount: 'Rs. 249.99',
    status: 'Completed',
    date: '2024-02-15',
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    amount: 'Rs. 189.99',
    status: 'Pending',
    date: '2024-02-14',
  },
  {
    id: '#ORD-003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    amount: 'Rs. 399.99',
    status: 'Shipped',
    date: '2024-02-13',
  },
  {
    id: '#ORD-004',
    customer: 'Alice Williams',
    email: 'alice@example.com',
    amount: 'Rs. 159.99',
    status: 'Cancelled',
    date: '2024-02-12',
  },
  {
    id: '#ORD-005',
    customer: 'Charlie Brown',
    email: 'charlie@example.com',
    amount: 'Rs. 579.99',
    status: 'Completed',
    date: '2024-02-11',
  },
]

export function AdminOrders() {
  const [orders, setOrders] = useState(ORDERS_LIST)
  const [filter, setFilter] = useState<string>('All')

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">
          Orders Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Shipped</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Customer
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Amount
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-secondary transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-primary">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-foreground">
                    {order.customer}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground text-sm">
                    {order.email}
                  </td>
                  <td className="py-4 px-6 text-foreground font-bold">
                    {order.amount}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed'
                          ? 'bg-accent/10 text-accent'
                          : order.status === 'Pending'
                          ? 'bg-muted text-foreground'
                          : order.status === 'Shipped'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground text-sm">
                    {order.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'primary' },
          { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: 'accent' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: 'secondary' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: 'destructive' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-background border border-border rounded-lg p-4 text-center"
          >
            <p className="text-muted-foreground text-sm mb-2">{label}</p>
            <p className={`text-2xl font-bold text-${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
