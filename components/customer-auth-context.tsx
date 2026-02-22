'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/auth-js'

type CustomerAuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null)

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    try {
      const supabase = createClient()
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }).catch(() => {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setUser(session?.user ?? null)
      })
      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    } catch {
      setUser(null)
      setLoading(false)
      return () => { mounted = false }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: fullName ? { data: { full_name: fullName.trim() } } : undefined,
      })
      if (error) return { error: error.message }
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign up failed' }
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) return { error: error.message }
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign in failed' }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // best effort
    }
  }, [])

  const value: CustomerAuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  return ctx
}
