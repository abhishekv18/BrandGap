import { m, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]

/**
 * One figure. With a numeric `value` it counts up once when it enters the
 * viewport; while `value` is null it shows the placeholder, rolled up into
 * view, so the section is fully usable before real numbers exist.
 */
export function Metric({ label, value, placeholder = '00', suffix = '', delay = 0, className = '' }) {
  const ref = useRef(null)
  const number = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = useReducedMotion()
  const hasValue = typeof value === 'number'

  useEffect(() => {
    if (!hasValue || !number.current) return
    if (reduced) {
      number.current.textContent = value.toLocaleString()
      return
    }
    if (!inView) return
    // A small count-up on the same easing curve as the rest of the site.
    const duration = 1800
    const start = performance.now() + delay * 1000
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      const eased = 1 - Math.pow(1 - t, 4)
      if (number.current) number.current.textContent = Math.round(value * eased).toLocaleString()
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hasValue, inView, reduced, value, delay])

  return (
    <div ref={ref} className={`flex flex-col-reverse justify-end border-t border-line pt-5 md:pt-6 ${className}`}>
      <dt className="label mt-4 text-ink-soft">{label}</dt>
      <dd className="font-display text-numeral tabular-nums">
        <span className="line-mask">
          <m.span
            className="block"
            initial={reduced ? false : { y: '105%' }}
            animate={reduced || inView ? { y: '0%' } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay }}
          >
            {hasValue ? (
              <span ref={number}>0</span>
            ) : (
              <span className="text-ink-muted" title="Placeholder — replace in src/data/metrics.js">
                {placeholder}
              </span>
            )}
            <span className="text-terracotta">{suffix}</span>
          </m.span>
        </span>
      </dd>
    </div>
  )
}
