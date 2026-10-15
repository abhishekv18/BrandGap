import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'

/** The WhatsApp glyph (single path), so the button is recognisable at a glance. */
export function WhatsAppGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  )
}
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { WHATSAPP } from '../data/contact'
import { track } from '../utils/analytics'

const EASE = [0.16, 1, 0.3, 1]

export const whatsappHref = () =>
  WHATSAPP.number ? `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}` : null

/**
 * Floating WhatsApp button on every page (brief §6), with a pre-filled message.
 * On the homepage it waits until the hero has played, so the opening screen
 * stays clean. While no number is set it explains that instead of failing.
 */
export function WhatsAppButton() {
  const { pathname } = useLocation()
  const [shown, setShown] = useState(false)
  const [note, setNote] = useState(false)
  const href = whatsappHref()

  useEffect(() => {
    // Home: after the hero lockup. Everywhere: out of the way of the footer's last row.
    const threshold = pathname === '/' ? 1.5 : 0.2
    const onScroll = () => {
      const y = window.scrollY
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 160
      setShown(y > window.innerHeight * threshold && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    if (!note) return
    const t = setTimeout(() => setNote(false), 5000)
    return () => clearTimeout(t)
  }, [note])

  const onClick = (e) => {
    track('whatsapp_click', { location: 'sticky', connected: Boolean(href) })
    if (!href) {
      e.preventDefault()
      setNote(true)
    }
  }

  const Tag = href ? 'a' : 'button'
  const props = href
    ? { href, target: '_blank', rel: 'noreferrer' }
    : { type: 'button', 'aria-describedby': note ? 'wa-note' : undefined }

  return (
    <AnimatePresence>
      {shown && (
        <m.div
          className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 md:right-6 md:bottom-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <AnimatePresence>
            {note && (
              <m.p
                id="wa-note"
                role="status"
                className="flex max-w-[16rem] items-start gap-2 bg-ink px-4 py-3 text-xs text-cream shadow-lg"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <span>
                  <span className="underline decoration-dotted underline-offset-4">{WHATSAPP.placeholder}</span> to be connected.
                </span>
                <button type="button" onClick={() => setNote(false)} aria-label="Dismiss" className="-m-1 p-1">
                  <X aria-hidden strokeWidth={1.5} className="size-3.5" />
                </button>
              </m.p>
            )}
          </AnimatePresence>
          <Tag
            {...props}
            onClick={onClick}
            aria-label="Chat with BrandGap on WhatsApp"
            className="group relative flex items-center"
          >
            {/* Hover: a small ink label slides out to the left, in the site's own type */}
            <span
              aria-hidden
              className="label pointer-events-none absolute right-[calc(100%+0.75rem)] flex items-center gap-2 rounded-full bg-[#140D10] px-4 py-2.5 text-[0.625rem] whitespace-nowrap text-cream opacity-0 shadow-[0_12px_28px_-14px_rgba(20,13,16,0.6)] transition-[opacity,translate] duration-500 ease-(--ease-out-expo) translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              <span className="size-1.5 rounded-full bg-[#25D366]" />
              Chat on WhatsApp
            </span>
            {/* The button: WhatsApp's green, recognisable at a glance, set in a cream ring so it sits on the paper */}
            <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_4px_rgb(244_233_225/0.9),0_16px_32px_-12px_rgba(20,13,16,0.45)] transition-[transform,background-color] duration-500 ease-(--ease-out-expo) group-hover:scale-105 group-hover:bg-[#1FBF5B]">
              {/* A slow, quiet pulse — off for reduced motion */}
              <span aria-hidden className="absolute inset-0 animate-[wa-pulse_2.8s_ease-out_infinite] rounded-full border border-[#25D366] motion-reduce:hidden" />
              <WhatsAppGlyph className="size-7" />
            </span>
          </Tag>
        </m.div>
      )}
    </AnimatePresence>
  )
}
