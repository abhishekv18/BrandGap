import { useLayoutEffect, useRef } from 'react'
import { ScrollTrigger, easeInOutCubic, range } from '../animations/gsap'
import { useReducedMotion } from '../hooks/useMediaQuery'

// Ink is a literal: inside an ink ground the --color-ink token is remapped to cream (see global.css).
const TONES = { ink: 'bg-[#1A1A1A]', blush: 'bg-blush' }
const EDGE = 48 // px the ground's top and bottom edges sit in while it's arriving or leaving
const SIDE = 2.5 // % of the width the sides sit in
const RADIUS = 28 // px corner radius at the start of the reveal

/**
 * A section's coloured ground, laid behind its content. As the section arrives the ground
 * opens from a rounded panel to the full width (the same move as the Final CTA's field),
 * and it closes back into a panel as the section leaves — so colour changes ease in with
 * the scroll instead of switching at a hard line. The inset only ever covers the section's
 * own padding, so its text always sits on its own ground.
 *
 * One ScrollTrigger per ground; it sets a clip-path from the scroll position (Lenis already
 * smooths the scroll, so no tween or loop is needed). Reduced motion: a plain, static ground.
 * The parent needs `relative isolate`.
 */
export function Ground({ tone }) {
  const el = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const layer = el.current
    if (!layer) return
    if (reduced) {
      layer.style.clipPath = ''
      return
    }
    const apply = (self) => {
      const vh = window.innerHeight
      const y = self.scroll()
      // Arriving: from the section's top at the bottom of the screen to 20% from the top.
      const enter = easeInOutCubic(range(y, self.start, self.start + vh * 0.8))
      // Leaving: from the section's bottom at 80% of the screen to the top.
      const leave = easeInOutCubic(range(self.end - y, 0, vh * 0.8))
      const open = Math.min(enter, leave)
      const top = (1 - enter) * EDGE
      const bottom = (1 - leave) * EDGE
      const side = (1 - open) * SIDE
      layer.style.clipPath = `inset(${top}px ${side}% ${bottom}px ${side}% round ${(1 - open) * RADIUS}px)`
    }
    const st = ScrollTrigger.create({
      trigger: layer.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      // Measured after the other triggers, so pins inside the section (the work rail) are already spaced.
      refreshPriority: -1,
      onUpdate: apply,
      onRefresh: apply,
    })
    apply(st)
    return () => {
      st.kill()
      layer.style.clipPath = ''
    }
  }, [reduced])

  return <div ref={el} aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${TONES[tone]}`} />
}
