import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useHrefClick } from '../hooks/useHrefClick'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { track } from '../utils/analytics'

const styles = {
  primary:
    'bg-terracotta text-cream hover:bg-terracotta-deep px-7 py-4 rounded-full label !tracking-[0.16em]',
  cream: 'bg-cream text-ink hover:bg-white px-7 py-4 rounded-full label !tracking-[0.16em]',
  ink: 'bg-ink text-cream hover:bg-terracotta px-7 py-4 rounded-full label !tracking-[0.16em]',
  text: 'text-ink label !tracking-[0.16em] py-3',
}

/**
 * A link that leans toward the pointer. In-page hrefs scroll smoothly,
 * site paths change route. The pull is subtle (a quarter of the offset) so it
 * reads as weight, not play. Pass `trackAs` to record a CTA click.
 */
export function MagneticButton({
  href,
  children,
  variant = 'primary',
  cursor,
  className = '',
  arrow = true,
  trackAs,
  type,
  disabled,
  onClick,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const hrefClick = useHrefClick()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })
  const innerX = useTransform(x, (v) => v * 0.35)
  const innerY = useTransform(y, (v) => v * 0.35)

  const onMove = (e) => {
    if (reduced || !ref.current || disabled) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.25)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const handleClick = (e) => {
    if (trackAs) track('cta_click', { cta: trackAs, href })
    onClick?.(e)
    if (href) hrefClick(e, href)
  }

  const Tag = href ? m.a : m.button
  const tagProps = href ? { href } : { type: type ?? 'button', disabled }

  return (
    <Tag
      ref={ref}
      {...tagProps}
      onClick={handleClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      data-cursor={cursor}
      className={`group relative inline-flex min-h-11 items-center gap-3 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      <m.span style={{ x: innerX, y: innerY }} className="relative inline-flex items-center gap-3">
        <span
          className={
            variant === 'text'
              ? 'bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-[position:0_100%] bg-no-repeat pb-1 transition-[background-size] duration-500 ease-(--ease-out-expo) group-hover:bg-[length:0%_1px] group-hover:bg-[position:100%_100%]'
              : ''
          }
        >
          {children}
        </span>
        {arrow && (
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="size-4 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1"
          />
        )}
      </m.span>
    </Tag>
  )
}
