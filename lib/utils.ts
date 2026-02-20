import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format amount as Indian Rupees (Rs.) – no cents */
export function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`
}
