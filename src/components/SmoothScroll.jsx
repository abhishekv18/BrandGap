import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animations/gsap'

const ScrollContext = createContext(null)

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside <SmoothScroll>')
  return ctx
}

/**
 * Lenis drives scrolling on desktop only. Touch devices and reduced-motion
 * users keep native scrolling; ScrollTrigger works the same either way.
 */
export function SmoothScroll({ enabled, children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  const api = useMemo(
    () => ({
      scrollTo(target, opts) {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        const lenis = lenisRef.current
        if (lenis) lenis.scrollTo(el ?? target, { offset: opts?.offset ?? 0, duration: 1.4 })
        else {
          // No Lenis (touch devices, reduced motion): native scrolling, smooth unless motion is reduced.
          const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
          if (typeof el === 'number') window.scrollTo({ top: el, behavior })
          else el?.scrollIntoView({ block: 'start', behavior })
        }

        // Move keyboard focus with the reader, so the next Tab continues from the section.
        if (el instanceof HTMLElement) {
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}
