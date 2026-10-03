import { m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../animations/gsap'
import { MARK_B_D, MARK_COLORS, MARK_G_D, MARK_VIEWBOX } from '../data/mark'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { trackPageView } from '../utils/analytics'
import { useSmoothScroll } from './SmoothScroll'

const EASE = [0.76, 0, 0.24, 1]
const VB = `${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`

let firstPage = true

/**
 * One page, as AnimatePresence sees it. Leaving: a cream curtain rises and
 * the b and the g close on it — the brand signature, in under a second.
 * Arriving: the curtain lifts. The page itself only fades (no transforms),
 * so sticky and pinned sections inside it keep working.
 */
export function PageShell({ children }) {
  const reduced = useReducedMotion()
  const location = useLocation()
  const main = useRef(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    trackPageView(location.pathname)
    const isFirst = firstPage
    firstPage = false
    // Recalculate scroll-driven sections once the new page has laid out.
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 120)
    // Deep links to a section (e.g. /free-audit#calculator) land after the curtain.
    const hash = location.hash
    const jump = hash ? setTimeout(() => scrollTo(hash), isFirst ? 300 : 750) : 0
    // Screen readers: announce the new page by moving focus to it.
    if (!isFirst && !hash) main.current?.focus({ preventScroll: true })
    return () => {
      clearTimeout(refresh)
      clearTimeout(jump)
    }
    // Runs once per page; the shell is keyed by pathname.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const curtain = reduced
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 0, transition: { duration: 0.3 } },
        exit: { opacity: [0, 1], transition: { duration: 0.25 } },
      }
    : {
        initial: { clipPath: 'inset(0% 0% 0% 0%)' },
        animate: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
        exit: { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], transition: { duration: 0.45, ease: EASE } },
      }

  const letter = (from) =>
    reduced
      ? {}
      : {
          initial: { x: 0, opacity: 1 },
          animate: { opacity: 0, transition: { duration: 0.2 } },
          // x is in the mark's viewBox units (505 tall ≈ 64–80px on screen)
          exit: { x: [from, 0], opacity: [0, 1], transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
        }

  return (
    <>
      <m.main
        ref={main}
        id="main"
        tabIndex={-1}
        className="overflow-x-clip outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.3 } }}
      >
        {children}
      </m.main>

      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-cream"
        {...curtain}
      >
        <svg viewBox={VB} className="h-16 w-auto overflow-visible md:h-20">
          <m.path d={MARK_B_D} fill={MARK_COLORS.b} {...letter(-300)} />
          <m.path d={MARK_G_D} fill={MARK_COLORS.g} {...letter(300)} />
        </svg>
      </m.div>
    </>
  )
}
