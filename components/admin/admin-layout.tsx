'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Package, ShoppingBag, Settings, LogOut, Menu, X, ChevronDown, ChevronRight, FileStack, Store, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/components/admin/admin-auth-context'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/promo-codes', label: 'Promo codes', icon: Tag },
]

const SETTINGS_SUB_ITEMS = [
  { href: '/admin/settings', label: 'General' },
  { href: '/admin/settings/categories', label: 'Categories' },
  { href: '/admin/settings/product-template', label: 'Product template', icon: FileStack },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAdminAuth()
  const isSettingsPath = pathname.startsWith('/admin/settings')
  const [settingsExpanded, setSettingsExpanded] = useState(isSettingsPath)

  // Desktop: open sidebar by default. Mobile: keep closed (drawer).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    if (mq.matches) setSidebarOpen(true)
  }, [])

  // Keep Settings dropdown open when on a settings sub-page
  useEffect(() => {
    if (isSettingsPath) setSettingsExpanded(true)
  }, [isSettingsPath])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Backdrop (mobile only) */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar: drawer on mobile, static on desktop */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col w-[280px] md:w-64 bg-card border-r border-border shadow-lg md:shadow-sm transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-5 border-b border-border shrink-0">
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
            Bixlay Admin
          </h1>
          <button
            type="button"
            onClick={closeSidebar}
            className="md:hidden p-2.5 -mr-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground touch-manipulation"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted'
                }`}
              >
                <Icon size={22} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            )
          })}

          {/* Settings dropdown with Product template */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setSettingsExpanded((e) => !e)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                isSettingsPath
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted'
              }`}
              aria-expanded={settingsExpanded}
              aria-controls="settings-submenu"
            >
              <Settings size={22} className="shrink-0" />
              <span className="truncate flex-1 text-left">Settings</span>
              {settingsExpanded ? (
                <ChevronDown size={18} className="shrink-0 opacity-70" />
              ) : (
                <ChevronRight size={18} className="shrink-0 opacity-70" />
              )}
            </button>
            <div
              id="settings-submenu"
              className={settingsExpanded ? 'block' : 'hidden'}
            >
              <div className="pl-4 pr-2 py-1 space-y-0.5 border-l-2 border-border ml-4 mt-0.5">
                {SETTINGS_SUB_ITEMS.map(({ href, label, icon: SubIcon }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted'
                      }`}
                    >
                      {SubIcon ? <SubIcon size={18} className="shrink-0" /> : <span className="w-[18px] shrink-0" />}
                      <span className="truncate">{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
          >
            <LogOut size={22} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 md:h-16 shrink-0 bg-background border-b border-border flex items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="p-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu size={24} />
            </button>
            <span className="text-sm text-muted-foreground truncate">Welcome back, Admin</span>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted text-sm font-medium transition-colors shrink-0"
          >
            <Store size={18} />
            Visit store
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
