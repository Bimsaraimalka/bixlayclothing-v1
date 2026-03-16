'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'cookie_consent'
const AD_SENSE_CLIENT = 'ca-pub-7938979901855907'

function loadAdSense() {
  if (typeof document === 'undefined') return
  if (document.querySelector('script[src*="adsbygoogle"]')) return
  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_SENSE_CLIENT}`
  script.async = true
  script.crossOrigin = 'anonymous'
  document.body.appendChild(script)
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent === 'accepted') {
      loadAdSense()
    }
    if (consent) {
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    loadAdSense()
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-foreground/90">
            We use cookies and similar technologies to improve your experience and to show relevant ads. By continuing to use our site, you agree to our use of cookies. See our{' '}
            <Link href="/privacy" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-lg border border-border bg-background font-medium text-sm hover:bg-muted transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
