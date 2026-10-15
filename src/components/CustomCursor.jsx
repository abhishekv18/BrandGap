import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const LABELS = {
  view: 'View',
  explore: 'Explore',
}

/**
 * Desktop-only cursor. Elements opt in with data-cursor="view|explore" for a labelled disc;
 * any other link or button gets a small arrow disc, set just below and to
 * the right of the pointer so it never covers the word being pointed at. Sections marked
 * data-cursor-invert (terracotta grounds) and data-cursor="start" buttons swap the fill to ink.
 */
export function CustomCursor() {
  const el = useRef(null)
  // The precise point: a small dot that sits exactly on the pointer (the ring and discs trail it).
  const point = useRef(null)
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
      if (point.current) point.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
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
      // "Start" buttons get the small arrow disc, in ink so it reads on their terracotta.
      const next =
        key && LABELS[key]
          ? { label: LABELS[key], mode: 'label', invert }
          : interactive
            ? { label: null, mode: 'hover', invert: invert || key === 'start' }
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

  // Project images get the "View" disc centred on the pointer; the smaller "Explore"
  // disc sits just below and to the right, so it never covers the link's own label.
  // At rest: a fine trailing ring around the precise dot. Over links the ring gives way to the
  // small arrow disc; over project images to the "View" disc.
  const hover = variant.mode === 'hover'
  const label = variant.mode === 'label'
  const dot = variant.mode === 'dot'
  const view = label && variant.label === 'View'
  const scale = label ? (view ? 0.95 : 0.6) : hover ? 0.3 : 0
  const shift = hover ? 'translate(1.375rem, 1.375rem) ' : label && !view ? 'translate(2.25rem, 2.25rem) ' : ''
  const fill = variant.invert ? 'bg-ink' : 'bg-terracotta'

  return (
    <>
    <div
      ref={point}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[201]"
      style={{ opacity: visible && dot ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <span className={`absolute -top-[3px] -left-[3px] block size-1.5 rounded-full transition-colors duration-300 ${variant.invert ? 'bg-ink' : 'bg-terracotta'}`} />
    </div>
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <span
        className={`absolute -top-[17px] -left-[17px] block size-[34px] rounded-full border ${variant.invert ? 'border-ink/45' : 'border-terracotta/55'}`}
        style={{
          opacity: dot ? 1 : 0,
          transform: `scale(${dot ? 1 : 0.4})`,
          transition: 'opacity 300ms, transform 450ms cubic-bezier(0.16,1,0.3,1), border-color 300ms',
        }}
      />
      <div
        className={`relative -mt-11 -ml-11 flex size-22 items-center justify-center rounded-full ${fill}`}
        style={{
          transform: `${shift}scale(${scale})`,
          transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1), background-color 300ms',
        }}
      >
        <span
          className="label text-cream"
          // Counter the disc's scale so the word always reads at the same 10.5px.
          style={{ fontSize: `${10.5 / (scale || 1)}px`, opacity: variant.label ? 1 : 0, transition: 'opacity 200ms' }}
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
    </>
  )
}
