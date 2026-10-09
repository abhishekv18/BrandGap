import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { CONTACT } from '../data/contact'
import { NAV_CTA, NAV_LINKS, NAV_TOOLS } from '../data/navigation'
import { useHrefClick } from '../hooks/useHrefClick'
import { track } from '../utils/analytics'
import { BrandMark, Wordmark } from './BrandMark'
import { trapTab } from './CaseDrawer'
import { useSmoothScroll } from './SmoothScroll'

const EASE = [0.16, 1, 0.3, 1]

export function Navbar() {
  const { stop, start } = useSmoothScroll()
  const hrefClick = useHrefClick()
  const { pathname } = useLocation()
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const firstLink = useRef(null)
  // Set when a menu link navigates, so closing the menu doesn't pull focus back to the button.
  const navigated = useRef(false)

  // Condense once the reader has left the opening screen (sooner on inner pages).
  useEffect(() => {
    const threshold = pathname === '/' ? 0.6 : 0.15
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Menu: lock scroll, close on Escape, trap focus, return focus.
  useEffect(() => {
    if (!open) return
    stop()
    document.body.style.overflow = 'hidden'
    firstLink.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      trapTab(e, document.getElementById('site-menu'))
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

  const go = (e, to) => {
    if (open) navigated.current = true
    setOpen(false)
    hrefClick(e, to)
  }

  const linkClass = ({ isActive }) =>
    `group relative flex min-h-11 items-center px-2 label lg:px-3 transition-colors hover:text-terracotta md:text-[0.875rem] md:tracking-[0.12em] desk:text-[0.75rem] desk:tracking-[0.18em] xl:px-4 ${
      isActive ? 'text-terracotta' : 'text-ink'
    }`

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page flex justify-center pt-3 md:pt-5">
          <nav
            aria-label="Primary"
            className={`pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full transition-[background-color,box-shadow,max-width,padding] duration-700 ease-(--ease-out-expo) ${
              condensed
                ? 'max-w-4xl bg-cream/95 py-2 pr-2 pl-4 shadow-[0_0_0_1px_var(--color-line)]'
                : 'max-w-[90rem] bg-transparent py-2 pr-0 pl-0'
            }`}
          >
            <a href="/" onClick={(e) => go(e, '/')} className="flex min-h-11 items-center gap-3" aria-label="BrandGap — home">
              <BrandMark className="h-8 w-auto" />
              <Wordmark className="text-[1.375rem] leading-none" />
            </a>

            <ul className="hidden items-center md:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} onClick={(e) => go(e, l.to)} className={linkClass}>
                    {({ isActive }) => (
                      <>
                        {l.label}
                        <span
                          aria-hidden
                          className={`absolute bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-terracotta transition-transform duration-500 ease-(--ease-out-expo) ${
                            isActive ? 'scale-100' : 'scale-0'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
              <li className="ml-1 lg:ml-2">
                <a
                  href={NAV_CTA.to}
                  onClick={(e) => {
                    track('cta_click', { cta: 'nav_start_project', href: NAV_CTA.to })
                    go(e, NAV_CTA.to)
                  }}
                  data-cursor="start"
                  className="label flex min-h-11 items-center rounded-full bg-ink px-4 text-[0.6875rem] whitespace-nowrap text-cream transition-colors duration-300 hover:bg-terracotta lg:px-5 lg:text-[0.75rem]"
                >
                  {NAV_CTA.label}
                </a>
              </li>
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
            data-lenis-prevent
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-terracotta text-cream"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="container-page flex items-center justify-between pt-3">
              <span className="flex min-h-11 items-center gap-3">
                {/* The b is terracotta, so on this ground the mark sits on a cream badge in its true colours */}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cream shadow-[0_6px_16px_-8px_rgba(28,18,22,0.45)]">
                  <BrandMark className="h-6 w-auto" />
                </span>
                <Wordmark tone="dark" className="text-[1.375rem] leading-none [&>span:last-child]:text-cream" />
              </span>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-full px-4 label">
                Close
              </button>
            </div>
            <ul className="container-page mt-auto flex flex-col gap-1 pt-10">
              {[{ to: '/', label: 'Home' }, ...NAV_LINKS].map((l, i) => (
                <m.li
                  key={l.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EASE }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={l.to}
                    onClick={(e) => go(e, l.to)}
                    aria-current={pathname === l.to ? 'page' : undefined}
                    className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.25rem,9vw,3.25rem)] leading-[1.05] aria-[current=page]:italic"
                  >
                    <span className="label text-cream">0{i + 1}</span>
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <m.div
              className="container-page mt-8 flex flex-wrap gap-x-6 gap-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {NAV_TOOLS.map((l) => (
                <a key={l.to} href={l.to} onClick={(e) => go(e, l.to)} className="label inline-flex min-h-11 items-center text-cream">
                  {l.label}
                </a>
              ))}
            </m.div>
            <div className="container-page mt-6 mb-8 flex flex-wrap items-center justify-between gap-4 border-t border-line-light pt-5">
              <a
                href={NAV_CTA.to}
                onClick={(e) => {
                  track('cta_click', { cta: 'menu_start_project', href: NAV_CTA.to })
                  go(e, NAV_CTA.to)
                }}
                className="label flex min-h-11 items-center rounded-full bg-cream px-6 text-ink"
              >
                {NAV_CTA.label}
              </a>
              <p className="flex flex-col items-end text-sm text-cream">
                <a href={CONTACT.email.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {CONTACT.email.label}
                </a>
                {CONTACT.phone.href && (
                  <a href={CONTACT.phone.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {CONTACT.phone.label}
                  </a>
                )}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
