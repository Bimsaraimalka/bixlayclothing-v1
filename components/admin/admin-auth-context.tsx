'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getStoredAuth, setStoredAuth, validateAdminCredentials } from '@/lib/admin-auth'

type AdminAuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsAuthenticated(getStoredAuth())
  }, [])

  const login = useCallback((email: string, password: string) => {
    const ok = validateAdminCredentials(email, password)
    if (ok) {
      setStoredAuth(true)
      setIsAuthenticated(true)
    }
    return ok
  }, [])

  const logout = useCallback(() => {
    setStoredAuth(false)
    setIsAuthenticated(false)
  }, [])

  const value: AdminAuthContextType = {
    isAuthenticated: mounted ? isAuthenticated : false,
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
