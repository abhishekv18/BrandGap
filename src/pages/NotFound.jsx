import { m } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MagneticButton } from '../components/MagneticButton'
import { MARK_B_D, MARK_COLORS, MARK_G_D, MARK_VIEWBOX } from '../data/mark'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useSeo } from '../hooks/useSeo'

const VB = `${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`
const EASE = [0.16, 1, 0.3, 1]

/**
 * 404 (brief §3): "You have found a gap. Let us close it."
 * The b and the g sit apart, breathing; closing the gap brings them together
 * into the mark, then takes the visitor home.
 */
export default function NotFound() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)

  useSeo({ title: 'Page not found', description: 'You have found a gap. Let us close it.', path: '/404', noindex: true })

  const close = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => navigate('/'), reduced ? 0 : 1100)
  }

  // Apart: the letters drift slowly; closed: they lock into the mark.
  const drift = (dir) =>
    closing
      ? { x: 0, y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } }
      : reduced
        ? { x: dir * 210, y: dir * -50, rotate: dir * -6 }
        : {
            x: [dir * 210, dir * 240, dir * 210],
            y: [dir * -50, dir * -32, dir * -50],
            rotate: [dir * -6, dir * -3, dir * -6],
            transition: { duration: 6, ease: 'easeInOut', repeat: Infinity },
          }

  return (
    <section aria-labelledby="nf-title" className="container-page flex min-h-[86svh] flex-col items-center justify-center pt-24 pb-12 text-center">
      <p className="label text-ink-muted">
        Error <span className="text-terracotta">404</span>
      </p>

      <svg viewBox={VB} aria-hidden className="mt-8 h-[24svh] max-h-52 w-auto overflow-visible md:mt-10">
        <m.path d={MARK_B_D} fill={MARK_COLORS.b} initial={false} animate={drift(-1)} style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }} />
        <m.path d={MARK_G_D} fill={MARK_COLORS.g} initial={false} animate={drift(1)} style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }} />
      </svg>

      <h1 id="nf-title" className="mt-10 max-w-[16ch] text-display md:mt-12">
        You have found a gap. <span className="italic text-terracotta">Let us close it.</span>
      </h1>
      <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
        <MagneticButton onClick={close} cursor="start" disabled={closing}>
          Close the gap
        </MagneticButton>
        <MagneticButton href="/work" variant="text">
          See the work
        </MagneticButton>
      </div>
    </section>
  )
}
