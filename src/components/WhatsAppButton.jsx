import { AnimatePresence, m } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
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
            className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-ink pr-3.5 pl-3.5 text-cream shadow-[0_12px_30px_-14px_rgba(26,26,26,0.55),0_0_0_1px_rgb(244_233_225/0.16)] transition-[background-color,gap,padding] duration-500 ease-(--ease-out-expo) hover:gap-2 hover:bg-terracotta hover:pr-5 focus-visible:gap-2 focus-visible:pr-5"
          >
            <MessageCircle aria-hidden strokeWidth={1.5} className="size-5 shrink-0" />
            <span className="label max-w-0 overflow-hidden text-[0.6875rem] whitespace-nowrap transition-[max-width] duration-500 ease-(--ease-out-expo) group-hover:max-w-24 group-focus-visible:max-w-24">
              WhatsApp
            </span>
          </Tag>
        </m.div>
      )}
    </AnimatePresence>
  )
}
