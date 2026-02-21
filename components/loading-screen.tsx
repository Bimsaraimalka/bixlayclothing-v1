'use client'

import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type LoadingScreenVariant = 'spinner' | 'productGrid' | 'productDetail'

type LoadingScreenProps = {
  /** Visual style of the loading state */
  variant?: LoadingScreenVariant
  /** Optional message shown below the spinner (spinner variant only) */
  message?: string
  /** Additional class names */
  className?: string
}

/** Animated loading dots for "Loading..." text */
function LoadingDots() {
  return (
    <span className="inline-flex gap-1 text-muted-foreground" aria-hidden>
      <span className="size-1.5 rounded-full bg-current animate-loading-dot opacity-70" />
      <span className="size-1.5 rounded-full bg-current [animation-delay:0.2s] animate-loading-dot opacity-70" />
      <span className="size-1.5 rounded-full bg-current [animation-delay:0.4s] animate-loading-dot opacity-70" />
    </span>
  )
}

export function LoadingScreen({
  variant = 'spinner',
  message,
  className,
}: LoadingScreenProps) {
  if (variant === 'productGrid') {
    return (
      <div
        className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in duration-300',
          className
        )}
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border overflow-hidden bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'productDetail') {
    return (
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 animate-in fade-in duration-300',
          className
        )}
        aria-busy="true"
        aria-label="Loading product"
      >
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full max-h-[420px] rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="size-16 sm:size-20 rounded-lg shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-14 rounded-lg" />
            <Skeleton className="h-10 w-14 rounded-lg" />
            <Skeleton className="h-10 w-14 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 animate-in fade-in duration-300',
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={message ?? 'Loading'}
    >
      <Loader2
        className="size-10 text-muted-foreground animate-spin"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        {message ?? (
          <>
            Loading
            <LoadingDots />
          </>
        )}
      </p>
    </div>
  )
}
