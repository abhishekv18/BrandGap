import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

const format = (v, decimals) =>
  v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/**
 * A number that counts up once, the first time it enters the viewport
 * (brief §8.2), on the site's ease-out curve. Reduced motion shows the final
 * value at once. Screen readers always get the final value.
 */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.8, delay = 0, className = '' }) {
  const ref = useRef(null)
  const number = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduced = useReducedMotion()
  const final = format(value, decimals)

  useEffect(() => {
    if (!number.current) return
    if (reduced) {
      number.current.textContent = final
      return
    }
    if (!inView) return
    const start = performance.now() + delay * 1000
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / (duration * 1000)))
      const eased = 1 - Math.pow(1 - t, 4)
      if (number.current) number.current.textContent = format(value * eased, decimals)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value, decimals, duration, delay, final])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
      <span aria-hidden>
        {prefix}
        <span ref={number}>{format(0, decimals)}</span>
        {suffix}
      </span>
    </span>
  )
}
