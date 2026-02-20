const ADMIN_EMAIL = 'admin@bixlay.com'
const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY = 'bixlay_admin_authenticated'

export function getStoredAuth(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function setStoredAuth(authenticated: boolean): void {
  if (typeof window === 'undefined') return
  if (authenticated) localStorage.setItem(STORAGE_KEY, 'true')
  else localStorage.removeItem(STORAGE_KEY)
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const e = email.trim().toLowerCase()
  const p = password
  return e === ADMIN_EMAIL.toLowerCase() && p === ADMIN_PASSWORD
}

export { ADMIN_EMAIL }
