'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getStoredAuth, setStoredAuth } from '@/lib/admin-auth'

export type AdminRole = 'owner' | 'admin' | null

type AdminAuthContextType = {
  isAuthenticated: boolean
  role: AdminRole
  isOwner: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<AdminRole>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsAuthenticated(getStoredAuth())
  }, [])

  useEffect(() => {
    if (!mounted || !isAuthenticated) return
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => setRole(data.role ?? null))
      .catch(() => setRole(null))
  }, [mounted, isAuthenticated])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!res.ok) return false
      setStoredAuth(true)
      setIsAuthenticated(true)
      setRole(null)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setStoredAuth(false)
    setIsAuthenticated(false)
    setRole(null)
  }, [])

  const value: AdminAuthContextType = {
    isAuthenticated: mounted ? isAuthenticated : false,
    role,
    isOwner: role === 'owner',
    login,
    logout,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
