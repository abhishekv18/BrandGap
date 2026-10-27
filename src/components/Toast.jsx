import { AnimatePresence, m } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const EVENT = 'bg-toast'
const EASE = [0.16, 1, 0.3, 1]

/** Shows a small confirmation in the top-right corner. Call from anywhere: toast('Thank you', 'We’ll be in touch.'). */
export function toast(title, body) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { title, body, id: Date.now() } }))
}

/** The toast host — mounted once, under the navigation. One toast at a time; each leaves after 4.5s. */
export function ToastHost() {
  const [item, setItem] = useState(null)

  useEffect(() => {
    const on = (e) => setItem(e.detail)
    window.addEventListener(EVENT, on)
    return () => window.removeEventListener(EVENT, on)
  }, [])

  useEffect(() => {
    if (!item) return
    const t = setTimeout(() => setItem(null), 4500)
    return () => clearTimeout(t)
  }, [item])

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed top-24 right-4 z-[70] w-[min(22rem,calc(100vw-2rem))] md:top-28 md:right-6">
      <AnimatePresence>
        {item && (
          <m.div
            key={item.id}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-[0.875rem] bg-[#140D10] py-3.5 pr-10 pl-3.5 text-cream shadow-[0_24px_50px_-24px_rgba(20,13,16,0.7),inset_0_0_0_1px_rgb(244_233_225/0.1)]"
          >
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-terracotta">
              <Check strokeWidth={2.25} className="size-4" />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block font-display text-lg leading-tight">{item.title}</span>
              {item.body && <span className="mt-1 block text-sm leading-snug text-cream/70">{item.body}</span>}
            </span>
            <button
              type="button"
              onClick={() => setItem(null)}
              aria-label="Dismiss"
              className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <X strokeWidth={1.5} className="size-3.5" />
            </button>
            {/* Time remaining */}
            <m.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#D9806F]"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
