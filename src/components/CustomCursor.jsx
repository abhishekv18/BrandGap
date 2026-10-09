import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const LABELS = {
  view: 'View',
  start: 'Start',
  explore: 'Explore',
}

/**
 * Desktop-only cursor. Elements opt in with data-cursor="view|start|explore";
 * any other link or button gets a small arrow disc, set just below and to
 * the right of the pointer so it never covers the word being pointed at. Sections marked
 * data-cursor-invert (terracotta grounds) swap the fill to ink.
 */
export function CustomCursor() {
  const el = useRef(null)
  const [variant, setVariant] = useState({ label: null, mode: 'dot', invert: false })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('has-custom-cursor')
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    let last = { label: null, mode: 'dot', invert: false }

    // The follow loop only runs while the dot is catching up, then sleeps.
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      if (el.current) el.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1 ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      target.x = e.clientX
      target.y = e.clientY
      setVisible(true)
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onOver = (e) => {
      const t = e.target
      if (!t) return
      const tagged = t.closest('[data-cursor]')
      const interactive = t.closest('a, button, [role="button"], label, summary')
      const invert = !!t.closest('[data-cursor-invert]')
      const key = tagged?.dataset.cursor
      const next =
        key && LABELS[key]
          ? { label: LABELS[key], mode: 'label', invert }
          : interactive
            ? { label: null, mode: 'hover', invert }
            : { label: null, mode: 'dot', invert }
      if (next.label !== last.label || next.mode !== last.mode || next.invert !== last.invert) {
        last = next
        setVariant(next)
      }
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  // Project images get a larger "View" disc, so the work feels like the thing to click.
  const hover = variant.mode === 'hover'
  const scale = variant.mode === 'label' ? (variant.label === 'View' ? 1.25 : 1) : hover ? 0.3 : 0.12
  const shift = hover ? 'translate(1.375rem, 1.375rem) ' : ''
  const fill = variant.invert ? 'bg-ink' : 'bg-terracotta'

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <div
        className={`relative -mt-11 -ml-11 flex size-22 items-center justify-center rounded-full border-cream ${fill}`}
        style={{
          transform: `${shift}scale(${scale})`,
          borderWidth: variant.mode === 'dot' ? 10 : 0,
          transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1), background-color 300ms',
        }}
      >
        <span
          className="label text-[0.6875rem] text-cream"
          style={{ opacity: variant.label ? 1 : 0, transition: 'opacity 200ms' }}
        >
          {variant.label}
        </span>
        <ArrowUpRight
          strokeWidth={2.25}
          className="absolute size-11 text-cream"
          style={{
            opacity: hover ? 1 : 0,
            transform: hover ? 'rotate(0deg)' : 'rotate(-45deg)',
            transition: 'opacity 250ms, transform 450ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}
