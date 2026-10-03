import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { analyticsConfigured, getConsent, initAnalytics, setConsent } from '../utils/analytics'
import { useHrefClick } from '../hooks/useHrefClick'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Cookie consent (brief §9.8). Shown only when at least one analytics ID is
 * configured — with no trackers there is nothing to consent to. Declining is
 * as easy as accepting, and nothing loads before a choice.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const hrefClick = useHrefClick()

  useEffect(() => {
    if (!analyticsConfigured) return
    const choice = getConsent()
    if (choice === 'granted') initAnalytics()
    else if (!choice) {
      const t = setTimeout(() => setOpen(true), 2500)
      return () => clearTimeout(t)
    }
  }, [])

  const choose = (value) => {
    setConsent(value)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[45] max-w-md bg-ink p-5 text-cream shadow-[0_20px_40px_-20px_rgba(26,26,26,0.6)] md:right-auto md:left-6 md:bottom-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="text-sm text-cream/85">
            We use analytics cookies to understand how the site is used. Nothing is tracked unless you accept.{' '}
            <a href="/privacy" onClick={(e) => hrefClick(e, '/privacy')} className="underline underline-offset-4">
              Privacy
            </a>
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="label min-h-11 rounded-full bg-cream px-5 text-ink transition-colors hover:bg-white"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="label min-h-11 rounded-full border border-cream/40 px-5 transition-colors hover:border-cream"
            >
              Decline
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
