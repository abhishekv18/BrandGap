import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CONTACT } from '../data/contact'
import { NAV_LINKS } from '../data/navigation'
import { BrandMark, Wordmark } from './BrandMark'
import { useSmoothScroll } from './SmoothScroll'

const EASE = [0.16, 1, 0.3, 1]

export function Navbar() {
  const { scrollTo, stop, start } = useSmoothScroll()
  const [condensed, setCondensed] = useState(false)
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const firstLink = useRef(null)
  // Set when a menu link navigates, so closing the menu doesn't pull focus back to the button.
  const navigated = useRef(false)

  // Condense once the reader has left the opening screen.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section in view.
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Menu: lock scroll, close on Escape, return focus.
  useEffect(() => {
    if (!open) return
    stop()
    document.body.style.overflow = 'hidden'
    firstLink.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      // Keep Tab inside the open menu (it is a modal dialog).
      if (e.key === 'Tab') {
        const items = document.getElementById('site-menu')?.querySelectorAll('a[href], button')
        if (!items?.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      if (!navigated.current) menuButton.current?.focus()
      navigated.current = false
    }
  }, [open, stop, start])

  const go = (e, id) => {
    e.preventDefault()
    if (open) navigated.current = true
    setOpen(false)
    scrollTo(`#${id}`)
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page flex justify-center pt-3 md:pt-5">
          <nav
            aria-label="Primary"
            className={`pointer-events-auto flex w-full items-center justify-between rounded-full transition-[background-color,box-shadow,max-width,padding] duration-700 ease-(--ease-out-expo) ${
              condensed
                ? 'max-w-3xl bg-cream/95 py-2 pr-2 pl-4 shadow-[0_0_0_1px_var(--color-line)]'
                : 'max-w-[1600px] bg-transparent py-2 pr-0 pl-0'
            }`}
          >
            <a
              href="#top"
              onClick={(e) => go(e, 'top')}
              className="flex min-h-11 items-center gap-3"
              aria-label="BrandGap — back to top"
            >
              <BrandMark className="h-8 w-auto" />
              <Wordmark className="text-[1.375rem] leading-none" />
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    aria-current={active === l.id ? 'location' : undefined}
                    className="group relative flex min-h-11 items-center px-4 label text-ink transition-colors hover:text-terracotta aria-[current]:text-terracotta"
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="absolute bottom-2 left-1/2 size-1 -translate-x-1/2 scale-0 rounded-full bg-terracotta transition-transform duration-500 ease-(--ease-out-expo) group-aria-[current]:scale-100"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex min-h-11 items-center gap-3 rounded-full px-4 label md:hidden"
            >
              Menu
              <span aria-hidden className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-ink" />
                <span className="block h-px w-3 self-end bg-ink" />
              </span>
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-theme="terracotta"
            className="fixed inset-0 z-[60] flex flex-col bg-terracotta text-cream"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="container-page flex items-center justify-between pt-3">
              <span className="flex min-h-11 items-center gap-3">
                <BrandMark tone="dark" className="h-8 w-auto" />
                <Wordmark
                  tone="dark"
                  className="text-[1.375rem] leading-none [&>span:last-child]:text-cream"
                />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-full px-4 label"
              >
                Close
              </button>
            </div>
            <ul className="container-page mt-auto mb-10 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <m.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EASE }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className="flex items-baseline gap-4 py-1 font-display text-[3.25rem] leading-[1.05]"
                  >
                    <span className="label text-cream">0{i + 1}</span>
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <p className="container-page border-t border-line-light pt-5 pb-8 text-sm text-cream">
              {CONTACT.email.label}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
