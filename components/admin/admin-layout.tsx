'use client'

import Link from 'next/link'
import { BarChart3, Package, ShoppingBag, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary text-primary-foreground transition-all duration-300 border-r border-primary/20`}
      >
        <div className="p-6 border-b border-primary-foreground/10">
          <h1 className="text-2xl font-serif font-bold">
            {sidebarOpen ? 'Bixlay Admin' : 'BA'}
          </h1>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {[
            { href: '/admin', label: 'Dashboard', icon: BarChart3 },
            { href: '/admin/products', label: 'Products', icon: Package },
            { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
            { href: '/admin/settings', label: 'Settings', icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
            </div>
          </button>
          <div className="text-sm text-muted-foreground">
            Welcome back, Admin
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-secondary/30 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
