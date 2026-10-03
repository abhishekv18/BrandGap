import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { AUDIT_OFFER } from '../data/contact'
import { track } from '../utils/analytics'
import { BrandMark } from './BrandMark'
import { trapTab } from './CaseDrawer'
import { MagneticButton } from './MagneticButton'
import { useSmoothScroll } from './SmoothScroll'

const EASE = [0.16, 1, 0.3, 1]
const KEY = 'bg-exit-intent'
// Pages where the offer would be redundant or in the way.
const SKIP = ['/free-audit', '/contact', '/gap-score']

/**
 * Exit-intent prompt (brief §6, optional): offers the free audit when a
 * desktop pointer leaves through the top of the window. Desktop only (render
 * it only for fine pointers), at most once per session, never in the first
 * few seconds, never on the conversion pages themselves.
 */
export function ExitIntent() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const panel = useRef(null)
  const { stop, start } = useSmoothScroll()

  useEffect(() => {
    if (SKIP.includes(pathname)) return
    let seen = false
    try {
      seen = sessionStorage.getItem(KEY) === '1'
    } catch {
      /* ignore */
    }
    if (seen) return
    const armedAt = performance.now() + 8000
    const onOut = (e) => {
      if (e.relatedTarget || e.clientY > 8 || performance.now() < armedAt) return
      if (document.querySelector('[role="dialog"]')) return
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      track('exit_intent_shown')
      setOpen(true)
    }
    document.addEventListener('mouseout', onOut)
    return () => document.removeEventListener('mouseout', onOut)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    stop()
    panel.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      trapTab(e, panel.current)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      start()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [open, stop, start])

  // Navigating away closes it.
  useEffect(() => setOpen(false), [pathname])

  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[80] flex items-center justify-center p-4" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <m.div
            aria-hidden
            className="absolute inset-0 bg-ink/45"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            tabIndex={-1}
            className="relative w-full max-w-[22rem] border border-line bg-cream px-7 pt-8 pb-6 lg:max-w-[26rem] lg:px-9 lg:pt-10 lg:pb-7 2xl:max-w-[28rem] text-center shadow-[0_30px_60px_-30px_rgba(26,26,26,0.5)] outline-none"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-1.5 right-1.5 flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-terracotta"
            >
              <X aria-hidden strokeWidth={1.5} className="size-4" />
            </button>
            <BrandMark className="mx-auto h-9 w-auto lg:h-11" />
            <p className="label mt-5 text-[0.6875rem] text-ink-muted">Before you go</p>
            <h2 id="exit-title" className="mx-auto mt-3 max-w-[16ch] font-display text-[1.625rem] leading-[1.12] lg:text-[2rem] 2xl:text-[2.125rem] tracking-[-0.01em]">
              {AUDIT_OFFER.title}
            </h2>
            <div className="mt-6 flex flex-col items-center gap-1 lg:mt-7">
              <MagneticButton href="/free-audit" onClick={() => setOpen(false)} trackAs="exit_intent_audit" className="!px-6 !py-3 text-[0.6875rem]">
                Get the free audit
              </MagneticButton>
              <button type="button" onClick={() => setOpen(false)} className="label min-h-11 text-[0.6875rem] text-ink-muted transition-colors hover:text-ink">
                No thanks
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
